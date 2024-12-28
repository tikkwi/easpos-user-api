import ACoreService from '@common/core/core.service';
import PriceAdjustment from './price_adjustment.schema';
import { BadRequestException, Inject } from '@nestjs/common';
import { REPOSITORY } from '@common/constant';
import Repository from '@common/core/repository';
import {
   GetAdjustedPriceDto,
   GetApplicableAdjustmentDto,
   GetBaseAdjustmentQueryDto,
   GetFocProductsDto,
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
      variants,
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
      [k('spendTrigger')]: {
         $or: [
            { $exists: false },
            {
               $and: [
                  {
                     'spendTrigger.unitId': price.unitId,
                     'spendTrigger.amount': { $lte: price.amount },
                  },
               ],
            },
         ],
      },
      [k('volumeTrigger')]: { $or: [{ $exists: false }, { $lte: quantity }] },
      [k('bundleTrigger')]: {
         $or: [
            { $exists: false },
            {
               $expr: {
                  $allElementsTrue: {
                     $map: {
                        input: '$bundleTrigger',
                        as: 'doc',
                        in: {
                           $and: [
                              {
                                 $in: ['$$doc.id', variants.map(({ id }) => id)],
                              },
                              {
                                 $gte: [
                                    {
                                       $arrayElemAt: [
                                          {
                                             $filter: {
                                                input: variants,
                                                as: 'qry',
                                                cond: {
                                                   $eq: ['$$qry.id', '$$doc.id'],
                                                },
                                             },
                                          },
                                          0,
                                       ],
                                       //@ts-ignore
                                    }.quantity,
                                    '$$doc.quantity',
                                 ],
                              },
                           ],
                        },
                     },
                  },
               },
            },
         ],
      },
      [k('tierTrigger.level')]: { $or: [{ $exists: false }, { $lte: tierLevel }] },
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

   async getApplicableAdjustments({
      promoCode,
      context,
      customerId,
      product,
      sale,
      ...dto
   }: GetApplicableAdjustmentDto) {
      const { data: customer } = await this.customerService.getCustomer({
         id: customerId,
         context,
      });
      if (sale) {
         for (const { appliedUnstackableAdjustment } of sale.products) {
            if (appliedUnstackableAdjustment)
               return {
                  data: undefined,
                  message: 'The un-stackable product adjustment is applied',
               };
         }
      }

      let variantId,
         appliedUnstackableVariant,
         price = sale?.price;
      if (product)
         ({
            data: { variantId, price, appliedUnstackableVariant },
         } = await this.stockUnitService.getStockPurchased({
            ...product,
            customerId,
            context,
         }));
      if (appliedUnstackableVariant)
         return { data: undefined, message: 'The un-stackable price variant is applied' };
      if (promoCode) {
         const { data: pC } = await this.promoCodeService.getAdjustmentWithPromoCode({
            promoCode,
            variantId,
            price,
            tierLevel: customer?.tier?.level,
            variants: sale?.products.map(({ id, quantity }) => ({
               id,
               quantity,
            })),
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
                  price: price,
                  tierLevel: customer?.tier?.level,
               }),
            },
         });
         return { data: await this.#filterProductAdjustments(adjustments, variantId) };
      }
   }

   //NOTE: protect to directly call not to trick sth like price
   async nc_getAdjustedPrice({
      price,
      productId,
      quantity,
      isMarkup,
      adjustment: {
         focStocksWithTargetAmount,
         focStocks,
         absoluteAdjustment,
         percentageAdjustment,
      },
      context,
   }: GetAdjustedPriceDto) {
      let focProducts: Array<ProductCompactDto> = [];
      if (focStocks || focStocksWithTargetAmount) {
         if (focStocksWithTargetAmount && !productId)
            throw new BadRequestException('ProductId is required');
         ({ data: focProducts } = await this.getFocProducts({
            productId,
            quantity,
            focStocks,
            focStocksWithTargetAmount,
            context,
         }));
      }
      const adjustment = percentageAdjustment
         ? price.amount * (percentageAdjustment / 100)
         : absoluteAdjustment;
      price.amount += adjustment * (isMarkup ? -1 : 1);
      return { data: { price, focProducts } };
   }

   async getFocProducts({
      productId,
      quantity,
      focStocks,
      focStocksWithTargetAmount,
      context,
   }: GetFocProductsDto) {
      const focProducts: Array<ProductCompactDto & { usedAdjustment: boolean }> = [];
      const pIds = focStocksWithTargetAmount ?? focStocks.map(({ stockId }) => stockId);

      const { data: pVs } = await this.productVariantService.findByIds({
         ids: pIds,
         populate: 'product',
         projection: { productVariant: 0 },
      });

      if (focStocksWithTargetAmount) {
         const { data: tProduct } = await this.productService.findById({
            id: productId,
            lean: false,
         });
         for (const {
            product: { unit },
         } of pVs) {
            if (unit !== tProduct.unit)
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
            context,
         });
         const baseInfo = ['name', 'description', 'attachments'];
         focProducts.push({
            ...(pick(pVs[i].product, baseInfo) as any),
            variant: { ...(pick(pVs[i], baseInfo) as any), units },
            usedAdjustment: true,
         });
      }
      return { data: focProducts };
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
