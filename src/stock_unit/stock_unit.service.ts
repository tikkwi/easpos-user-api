import AppService from '@common/decorator/app_service.decorator';
import ACoreService from '@common/core/core.service';
import StockUnit from './stock_unit.schema';
import { BadRequestException, Inject } from '@nestjs/common';
import { REPOSITORY } from '@common/constant';
import Repository from '@common/core/repository';
import UnitService from '@shared/unit/unit.service';
import { GetStockPurchasedDto, GetStockUnitDto } from './stock_unit.dto';
import { EProductUnitStatus } from '@common/utils/enum';
import CustomerService from '../customer/customer.service';
import { Amount } from '@common/dto/entity.dto';

@AppService()
export default class StockUnitService extends ACoreService<StockUnit> {
   constructor(
      @Inject(REPOSITORY) protected readonly repository: Repository<StockUnit>,
      private readonly unitService: UnitService,
      private readonly customerService: CustomerService,
   ) {
      super();
   }

   async getStockUnit({ barcode, variantId, populate, lean }: GetStockUnitDto) {
      return this.repository.findOne({
         filter: { barcode, productVariant: variantId },
         errorOnNotFound: true,
         options: { lean, populate },
      });
   }

   async getStockPurchased({
      barcode,
      quantity,
      nextBatchOnStockOut,
      customerId,
   }: GetStockPurchasedDto) {
      const { data: baseUnit } = await this.unitService.getBase({ unitId: quantity.unitId });
      const { data: baseQuantity } = await this.unitService.exchangeUnit({ current: [quantity] });
      const { data: customer } = await this.customerService.getCustomer({ id: customerId });
      let missingQuantity = baseQuantity;
      const stocks: Array<{
         stock: StockUnit;
         quantity: number;
         basePrice: Amount;
         multiplier: number;
         usedVariant: boolean;
         isStackable: boolean;
      }> = [];
      const stockIds: Array<ObjectId> = [];
      const updateQuantity = (stk?: StockUnit) => {
         if (!stk?.isOutOfStock) {
            const price = {
               basePrice: stk.productVariant.basePrice,
               multiplier: 1,
               usedVariant: false,
               isStackable: false,
            };
            const tags = new Set([
               ...customer.tags.map((e: any) => e.toString()),
               ...stk.tags.map((e: any) => e.toString()),
            ]);
            if (stk.productVariant.tagPrices.length) {
               for (const { isStackable, id, baseMultiplier, foc } of stk.productVariant
                  .tagPrices) {
                  if (tags.has(id)) {
                     if (foc) {
                        price.multiplier = 0;
                        price.usedVariant = true;
                        break;
                     }
                     if (baseMultiplier < price.multiplier) {
                        price.multiplier = baseMultiplier;
                        price.usedVariant = true;
                        price.isStackable = isStackable;
                     }
                  }
               }
            }
            const updQty =
               stk.stockLeft >= missingQuantity ? missingQuantity : missingQuantity - stk.stockLeft;
            missingQuantity -= updQty;
            stocks.push({ stock: stk, quantity: updQty, ...price });
            stockIds.push(stk._id);
         }
      };
      const { data: stock } = await this.getStockUnit({
         barcode,
         populate: { path: 'productVariant', populate: ['product'] },
      });
      if (stock.status !== EProductUnitStatus.Available)
         throw new BadRequestException(stock.status);
      updateQuantity(stock);
      if (missingQuantity && nextBatchOnStockOut) {
         const { data: eOStock } = await this.repository.findOne({ filter: { earlyOut: true } });
         updateQuantity(eOStock);
      }
      if (missingQuantity) {
         let stkLeft = true;
         while (missingQuantity && stkLeft) {
            const stk = await this.repository.custom((model) =>
               model.aggregate([
                  { $match: { _id: { $nin: stockIds } } },
                  {
                     $lookup: {
                        from: 'product',
                        localField: 'productVariant',
                        foreignField: '_id',
                        as: 'productVariant',
                     },
                  },
                  { $addFields: { sortField: { $ifNull: ['$expireAt', '$createdAt'] } } },
                  { $sort: { sortField: 1 } },
                  { $limit: 1 },
               ]),
            );
            if (stk.length) updateQuantity(stk[0]);
            else stkLeft = false;
         }
      }
      if (missingQuantity)
         throw new BadRequestException(
            `Required ${baseQuantity} ${baseUnit.name} and only ${baseQuantity - missingQuantity} ${baseUnit.name} left`,
         );
      return { data: stocks };
   }
}
