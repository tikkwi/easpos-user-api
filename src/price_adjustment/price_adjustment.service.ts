import ACoreService from '@common/core/core.service';
import PriceAdjustment from './price_adjustment.schema';
import { BadRequestException, Inject } from '@nestjs/common';
import { REPOSITORY } from '@common/constant';
import Repository from '@common/core/repository';
import {
   GetApplicableProductAdjustmentDto,
   GetBaseAdjustmentQueryDto,
   GetFocProductsDto,
   GetProductPriceDto,
} from './price_adjustment.dto';
import { EStatus } from '@common/utils/enum';
import StockUnitService from '../stock_unit/stock_unit.service';
import { isWithinPeriod } from '@common/utils/datetime';
import CustomerService from '../customer/customer.service';
import { PromoCodeService } from '../promo_code/promo_code.service';
import ProductService from '../product/product.service';
import { ProductVariantService } from '../product_variant/product_variant.service';
import { pick } from 'lodash';
import { ProductCompactDto } from '../product/product.dto';

export const getBaseAdjustmentQuery = (
   {
      paymentMethodId,
      currencyId,
      quantity,
      tierLevel,
      variantId,
      price,
   }: GetBaseAdjustmentQueryDto,
   prefix = '',
) => {
   const k = (key: string) => `${prefix ? `${prefix}.` : ''}${key}`;
   return {
      [k('status')]: EStatus.Active,
      [k('appliedProducts')]: variantId ? { $elemMatch: { $eq: variantId } } : undefined,
      [k('paymentMethodTrigger')]: {
         $or: [{ $exists: false }, { $elemMatch: { $eq: paymentMethodId } }],
      },
      [k('currencyTrigger')]: { $or: [{ $exists: false }, { $elemMatch: { $eq: currencyId } }] },
      [k('spendTrigger.amount')]: { $or: [{ $exists: false }, { $elemMatch: { $eq: price } }] },
      [k('volumeTrigger')]: { $or: [{ $exists: false }, { $lte: quantity }] },
      $or: [
         { [k('tierTrigger')]: { $exists: false } },
         { [k('tierTrigger.level')]: { $lte: tierLevel } },
      ],
   };
};

export default class PriceAdjustmentService extends ACoreService<PriceAdjustment> {
   constructor(
      @Inject(REPOSITORY) protected readonly repository: Repository<PriceAdjustment>,
      private readonly stockUnitService: StockUnitService,
      private readonly customerService: CustomerService,
      private readonly promoCodeService: PromoCodeService,
      private readonly productService: ProductService,
      private readonly productVariantService: ProductVariantService,
   ) {
      super();
   }

   async getApplicableProductAdjustment({
      promoCode,
      barcode,
      quantity,
      nextBatchOnStockOut,
      customerId,
      ...dto
   }: GetApplicableProductAdjustmentDto) {
      const { data: customer } = await this.customerService.getCustomer({ id: customerId });
      const {
         data: { variantId, price, priceVariant },
      } = await this.stockUnitService.getStockPurchased({
         barcode,
         quantity,
         nextBatchOnStockOut,
         customerId,
      });
      if (!priceVariant.isStackable)
         return { data: undefined, message: 'The un-stackable price variant is applied' };
      if (promoCode) {
         const { data: pC } = await this.promoCodeService.getAdjustmentWithPromoCode({
            promoCode,
            variantId,
            price: price.amount,
            tierLevel: customer?.tier?.level,
            ...dto,
         });
         if (pC?.promotion) return await this.#filterProductAdjustments([pC.promotion], variantId);
         return { data: undefined, message: 'Promo code is not eligible' };
      } else {
         const { data: adjustments } = await this.repository.find({
            filter: {
               autoTrigger: true,
               ...getBaseAdjustmentQuery({
                  ...dto,
                  variantId,
                  price: price.amount,
                  tierLevel: customer?.tier?.level,
               }),
            },
         });
         return { data: await this.#filterProductAdjustments(adjustments, variantId) };
      }
   }

   async getFocProducts({
      applyWholeSale,
      productId,
      quantity,
      focStocks,
      focStocksWithTargetAmount,
   }: GetFocProductsDto) {
      const focProducts: Array<ProductCompactDto> = [];

      const { data: tProduct } = await this.productService.findById({
         id: productId,
         lean: false,
      });
      const pIds = focStocksWithTargetAmount ?? focStocks.map(({ stockId }) => stockId);

      const { data: pVs } = await this.productVariantService.findByIds({
         ids: pIds,
         populate: 'product',
         projection: { productVariant: 0 },
      });

      if (!applyWholeSale) {
         for (const {
            product: {
               unitQuantity: { unitId },
            },
         } of pVs) {
            if (unitId !== tProduct.unitQuantity.unitId)
               throw new BadRequestException('FOC Stock unit differ from target stock');
         }
      }

      for (let i = 0; i < pIds.length; i++) {
         const {
            data: { units },
         } = await this.stockUnitService.getStockPurchased({
            variantId: pIds[i],
            nextBatchOnStockOut: true,
            isFoc: true,
            quantity: focStocksWithTargetAmount ? quantity : focStocks[i].quantity,
         });
         const baseInfo = ['name', 'description', 'attachments'];
         focProducts.push({
            ...(pick(pVs[i].product, baseInfo) as any),
            variant: { ...(pick(pVs[i], baseInfo) as any), units },
         });
      }
      return { data: focProducts };
   }

   async getProductPrice({
      price,
      productId,
      quantity,
      adjustment: {
         focStocksWithTargetAmount,
         focStocks,
         absoluteAdjustment,
         percentageAdjustment,
         isMarkup,
         applyWholeSale,
      },
   }: GetProductPriceDto) {
      let focProducts: Array<ProductCompactDto> = [];
      if (focStocks || focStocksWithTargetAmount)
         ({ data: focProducts } = await this.getFocProducts({
            productId,
            quantity,
            focStocks,
            focStocksWithTargetAmount,
            applyWholeSale,
         }));
      const adjustment = percentageAdjustment
         ? price.amount * (percentageAdjustment / 100)
         : absoluteAdjustment;
      price.amount += adjustment * (isMarkup ? -1 : 1);
      return { data: { price, focProducts } };
   }

   async #filterProductAdjustments(adjustments: Array<PriceAdjustment>, id: string) {
      const f_adjustments: Array<PriceAdjustment> = [];
      const { data: stockLeft } = await this.stockUnitService.getStockLeft({ id });
      for (const adjustment of adjustments) {
         if (adjustment.stockLevelHigherTrigger && stockLeft > adjustment.stockLevelHigherTrigger)
            f_adjustments.push(adjustment);
         else if (
            adjustment.stockLevelLowerTrigger &&
            stockLeft < adjustment.stockLevelLowerTrigger
         )
            f_adjustments.push(adjustment);
         else if (
            adjustment.timeTrigger &&
            isWithinPeriod(adjustment.timeTrigger.from, adjustment.timeTrigger.to)
         )
            f_adjustments.push(adjustment);
      }
      return f_adjustments;
   }
}
