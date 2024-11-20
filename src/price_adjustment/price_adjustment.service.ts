import ACoreService from '@common/core/core.service';
import PriceAdjustment from './price_adjustment.schema';
import { Inject } from '@nestjs/common';
import { REPOSITORY } from '@common/constant';
import Repository from '@common/core/repository';
import { NewSaleDto, ProductPurchasedDto } from '../sale/sale.dto';
import { GetBaseAdjustmentQueryDto, GetProductPriceDto } from './price_adjustment.dto';
import { EStatus } from '@common/utils/enum';
import StockUnitService from '../stock_unit/stock_unit.service';
import UnitService from '@shared/unit/unit.service';
import { isWithinPeriod } from '@common/utils/datetime';
import CustomerService from '../customer/customer.service';
import { PromoCodeService } from '../promo_code/promo_code.service';
import { ProductVariantService } from '../product_variant/product_variant.service';

export const getBaseAdjustmentQuery = (
   { paymentMethodId, currencyId, baseAmount, tierLevel, variantId }: GetBaseAdjustmentQueryDto,
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
      [k('volumeTrigger')]: { $or: [{ $exists: false }, { $lte: baseAmount }] },
      $or: [
         { [k('tierTrigger')]: { $exists: false } },
         { [k('tierTrigger.level')]: { $lte: tierLevel } },
      ],
   };
};

export default class PriceAdjustmentService extends ACoreService<PriceAdjustment> {
   constructor(
      @Inject(REPOSITORY) protected readonly repository: Repository<PriceAdjustment>,
      private readonly productVariantService: ProductVariantService,
      private readonly stockUnitService: StockUnitService,
      private readonly unitService: UnitService,
      private readonly customerService: CustomerService,
      private readonly promoCodeService: PromoCodeService,
   ) {
      super();
   }

   async getProductBasePrice({ stockUnits, variantId }: ProductPurchasedDto) {
      const b = [];
      for (const { barcode } of stockUnits) {
         const { data: stockUnit } = await this.stockUnitService.getStockUnit({
            barcode,
            variantId,
            populate: ['productVariant'],
         });
      }
   }

   async getProductPrice({
      promoCode,
      variantId,
      stockUnits,
      customerId,
      ...dto
   }: GetProductPriceDto) {
      const { data: baseAmount } = await this.unitService.exchangeUnit({ current: [quantity] });
      const { data: customer } = await this.customerService.getCustomer({ id: customerId });
      const { data: productVariaxnt } = await this.productVariantService.findById({
         id: variantId,
         errorOnNotFound: true,
      });

      // const basePrice = product.ba
      if (promoCode) {
         const { data: pC } = await this.promoCodeService.getAdjustmentWithPromoCode({
            promoCode,
            variantId,
            baseAmount,
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
                  baseAmount,
                  tierLevel: customer?.tier?.level,
               }),
            },
         });
         return { data: await this.#filterProductAdjustments(adjustments, variantId) };
      }
   }

   async getApplicableSaleAdjustments({
      promoCode,
      currencyId,
      paymentMethodId,
      products,
   }: NewSaleDto) {}

   async #filterProductAdjustments(adjustments: Array<PriceAdjustment>, id: string) {
      const f_adjustments: Array<PriceAdjustment> = [];
      // const { data: stockLeft } = await this.stockUnitService.getStockLeft({ id });
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
