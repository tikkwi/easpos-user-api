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
import { PriceVariant } from '../product/product.schema';
import { FindByIdDto } from '@common/dto/core.dto';
import { Amount } from '@common/dto/entity.dto';

type PurchasedStockUnit = {
   stock: AppSchema<StockUnit>;
   quantity: Amount;
   price: Amount;
   focQuantity?: Amount;
   priceVariant?: PriceVariant;
};

@AppService()
export default class StockUnitService extends ACoreService<StockUnit> {
   constructor(
      @Inject(REPOSITORY) protected readonly repository: Repository<StockUnit>,
      private readonly unitService: UnitService,
      private readonly customerService: CustomerService,
   ) {
      super();
   }

   async getStockLeft({ id }: Pick<FindByIdDto, 'id'>) {
      let sL = 0;
      const { data } = await this.repository.find({
         filter: { productVariant: id, isOutOfStock: false },
      });
      data.forEach(({ stockLeft }) => (sL += stockLeft));
      return { data: sL };
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
      variantId,
      quantity,
      nextBatchOnStockOut,
      customerId,
      isFoc,
      context,
   }: GetStockPurchasedDto) {
      const { data: baseUnit } = await this.unitService.getBase({ unitId: quantity.unitId });
      const { data: baseQuantity } = await this.unitService.exchangeUnit({ current: [quantity] });
      const { data: customer } = customerId
         ? await this.customerService.getCustomer({ id: customerId, context })
         : { data: undefined };
      let missingQuantity = baseQuantity;
      const units: Array<PurchasedStockUnit> = [];
      let stock: StockUnit;
      const unitIds: Array<ObjectId | string> = [];
      const price = { amount: 0, unitId: stock.productVariant.basePrice.unitId };
      let appliedUnstackableVariant = false;
      const updateQuantity = async (stk?: AppSchema<StockUnit>) => {
         if (!stk?.isOutOfStock) {
            const updQty =
               stk.stockLeft >= missingQuantity ? missingQuantity : missingQuantity - stk.stockLeft;
            missingQuantity -= updQty;
            const unt: PurchasedStockUnit = {
               stock: stk,
               quantity: {
                  amount: (
                     await this.unitService.exchangeUnit({
                        current: [{ amount: updQty }],
                        targetId: quantity.unitId,
                     })
                  ).data,
                  unitId: quantity.unitId,
               },
               price: { amount: 0, unitId: stock.productVariant.basePrice.unitId },
            };
            if (!isFoc) {
               let priceVariant: PriceVariant;
               const tags = new Set([
                  ...(customer ? customer.tags.map((e: any) => e.toString()) : []),
                  ...stock.tags.map((e: any) => e.toString()),
                  ...stock.productVariant.tags.map((e: any) => e.toString()),
                  ...stock.productVariant.product.tags.map((e: any) => e.toString()),
               ]);
               if (tags.size && stock.productVariant.product.priceVariants.length) {
                  for (const pV of stock.productVariant.product.priceVariants) {
                     if (!priceVariant || priceVariant.baseMultiplier < pV.baseMultiplier) {
                        priceVariant = pV;
                        if (pV.foc) break;
                     }
                  }
               }
               unt.price = {
                  amount: stock.productVariant.basePrice.amount * updQty,
                  unitId: stock.productVariant.basePrice.unitId,
               };
               if (priceVariant) {
                  unt.priceVariant = priceVariant;
                  if (priceVariant.foc) {
                     unt.price.amount -=
                        priceVariant.focQuantity * stock.productVariant.basePrice.amount;
                     unt.focQuantity = { amount: priceVariant.focQuantity, unitId: baseUnit.id };
                  } else unt.price.amount *= priceVariant.baseMultiplier;
               }
            }
            price.amount += unt.price.amount;
            units.push(unt);
            unitIds.push(stk.id);
            if (!appliedUnstackableVariant)
               appliedUnstackableVariant = unt.priceVariant?.isStackable;
         }
      };
      ({ data: stock } = barcode
         ? await this.getStockUnit({
              barcode,
              populate: { path: 'productVariant', populate: ['product'] },
           })
         : undefined);
      if (stock) await updateQuantity(stock);
      if ((missingQuantity && nextBatchOnStockOut) || variantId) {
         const { data: eOStock } = await this.repository.findOne({
            filter: {
               earlyOut: true,
               productVariant: variantId ?? stock.productVariant,
            },
         });
         if (!stock) stock = eOStock;
         await updateQuantity(eOStock);
      }
      if (stock.status !== EProductUnitStatus.Available)
         throw new BadRequestException(stock.status);

      if (missingQuantity) {
         let stkLeft = true;
         while (missingQuantity && stkLeft) {
            const stk = await this.repository.custom((model) =>
               model.aggregate([
                  { $match: { _id: { $nin: unitIds } } },
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
            if (stk.length) await updateQuantity(stk[0]);
            else stkLeft = false;
         }
      }
      if (missingQuantity)
         throw new BadRequestException(
            `Required ${baseQuantity} ${baseUnit.name} and only ${baseQuantity - missingQuantity} ${baseUnit.name} left`,
         );
      return {
         data: { units, variantId: stock.productVariant.id, price, appliedUnstackableVariant },
      };
   }
}
