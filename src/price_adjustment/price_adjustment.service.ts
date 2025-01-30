import PriceAdjustment from './price_adjustment.schema';
import { GetApplicableAdjustmentDto, IsAdjustmentApplicableDto } from './price_adjustment.dto';
import StockUnitService from '../stock_unit/stock_unit.service';
import CustomerService from '../customer/customer.service';
import { PromoCodeService } from '../promo_code/promo_code.service';
import { ModuleRef } from '@nestjs/core';
import APriceAdjustmentService from '@shared/price_adjustment/price_adjustment.service';
import UnitService from '@shared/unit/unit.service';
import SaleService from '../sale/sale.service';
import { isDateWithinPeriod } from '@common/utils/period';
import { ProductVariantService } from '../product_variant/product_variant.service';

export default class PriceAdjustmentService extends APriceAdjustmentService<PriceAdjustment> {
   protected promoCodeService: PromoCodeService;

   constructor(
      protected readonly moduleRef: ModuleRef,
      protected readonly unitService: UnitService,
      private readonly productVariantService: ProductVariantService,
      private readonly stockUnitService: StockUnitService,
      private readonly customerService: CustomerService,
      private readonly saleService: SaleService,
   ) {
      super();
   }

   onModuleInit(): any {
      this.promoCodeService = this.moduleRef.get(PromoCodeService, { strict: false });
   }

   async getApplicableAdjustments({
      ctx,
      promoCode,
      customerId,
      payment,
      price,
      appliedProductAdjustments,
      productId,
      quantity,
   }: GetApplicableAdjustmentDto) {
      const repository = await this.getRepository(ctx.connection, ctx.session);
      const { data: customer } = customerId
         ? await this.customerService.getCustomer({
              ctx,
              id: customerId,
              populate: ['tier'],
           })
         : { data: undefined };
      const { data: stockLeft } = await this.stockUnitService.getStockLeft({
         ctx,
         id: productId,
      });
      const { data: adjustments } = await repository.find({
         filter: {
            ...this.getBaseApplicableAdjustmentFilter(payment, [
               { tierTrigger: null },
               {
                  tierTrigger: {
                     $elemMatch: {
                        level: customer.tier ? { $lte: customer.tier.level } : { $eq: 'not found' },
                     },
                  },
               },

               ...(productId
                  ? [
                       { stockLevelHigherTrigger: null },
                       { stockLevelHigherTrigger: { $lte: stockLeft } },

                       { stockLevelLowerTrigger: null },
                       { stockLevelLowerTrigger: { $gte: stockLeft } },

                       { volumeTrigger: null },
                       { volumeTrigger: { $gte: quantity } },
                    ]
                  : [{ bundleTrigger: null }, { $expr: { $setEquals: ['$bundleTrigger'] } }]),
            ]),
            autoTrigger: !promoCode,
            applyWholeSale: !productId,
            stackable: !productId && appliedProductAdjustments ? true : undefined,
         },
      });
      return await this.$getApplicableAdjustments({
         dto: { ctx, promoCode, payment, price },
         adjustments,
         res: {},
         getApplicableAdjustment: async (dto) => {
            const adj = dto.priceAdjustment.adjustment;
            const focQty = adj.focStock
               ? adj.focStock.targetAmount
                  ? quantity
                  : adj.focStock.quantity
               : undefined;
            if (focQty) {
               const { data: stkLeft } = await this.stockUnitService.getStockLeft({
                  ctx,
                  id: adj.focStock.stockId,
               });

               const { data: stock } = await this.productVariantService.findById({
                  ctx,
                  id: adj.focStock.stockId,
               });
               const availQty = Math.min(quantity, stkLeft);
               dto['focStock'] = {
                  stock,
                  quantity: availQty,
                  stockLeft: stkLeft,
               };
            }
            return dto;
         },
         getIsAdjustmentApplicableDto: (dto) => ({ ...dto, customerId }),
      });
   }

   async isAdjustmentApplicable({
      ctx,
      payment,
      price,
      adjustmentId,
      customerId,
   }: IsAdjustmentApplicableDto): Promise<boolean> {
      const { data: adjustment } = await this.findById({ ctx, id: adjustmentId });
      const vSpendDto = {
         ctx,
         currencyId: payment.currencyId,
         trigger: adjustment.spendTrigger,
         triggerBelow: adjustment.spendTriggerBelow,
      };
      if (adjustment.spendTrigger && !(await this.validateSpendTrigger({ price, ...vSpendDto })))
         return false;
      if (adjustment.totalSpendTrigger) {
         const { data: customerPurchases } = await this.saleService.getCustomerPurchases({
            ctx,
            id: customerId,
            duration: adjustment.totalSpendDuration,
         });
         let prevSpend = 0;
         for (const { paidPrice } of customerPurchases) {
            const { data: excPrice } = await this.unitService.exchangeUnit({
               ctx,
               current: [{ amount: paidPrice, unitId: payment.currencyId }],
               targetId: payment.currencyId,
            });
            prevSpend += excPrice;
         }
         const totalSpend = prevSpend + price;
         if (!(await this.validateSpendTrigger({ price: totalSpend, ...vSpendDto }))) return false;
      }
      return !(adjustment.timeTrigger && !isDateWithinPeriod(adjustment.timeTrigger));
   }
}
