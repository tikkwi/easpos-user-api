import ACoreService from '@common/core/core.service';
import PriceAdjustment from './price_adjustment.schema';
import { Inject } from '@nestjs/common';
import { REPOSITORY } from '@common/constant';
import Repository from '@common/core/repository';
import { NewSaleDto } from '../sale/sale.dto';
import {
   GetApplicableProductAdjustmentDto,
   GetBaseAdjustmentQueryDto,
} from './price_adjustment.dto';
import { EStatus } from '@common/utils/enum';
import StockUnitService from '../stock_unit/stock_unit.service';
import UnitService from '@shared/unit/unit.service';
import { isWithinPeriod } from '@common/utils/datetime';
import CustomerService from '../customer/customer.service';
import { PromoCodeService } from '../promo_code/promo_code.service';

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
      private readonly stockUnitService: StockUnitService,
      private readonly unitService: UnitService,
      private readonly customerService: CustomerService,
      private readonly promoCodeService: PromoCodeService,
   ) {
      super();
   }

   async getApplicableProductAdjustments({
      promoCode,
      variantId,
      amount,
      customerId,
      ...dto
   }: GetApplicableProductAdjustmentDto) {
      const { data: baseAmount } = await this.unitService.exchangeUnit({ current: [amount] });
      const { data: customer } = await this.customerService.getCustomer({ id: customerId });
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
      coupon,
      currencyId,
      paymentMethodId,
      products,
   }: NewSaleDto) {}

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
