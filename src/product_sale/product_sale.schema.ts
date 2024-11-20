import { Schema } from '@nestjs/mongoose';
import BaseSchema from '@common/core/base.schema';
import AppProp from '@common/decorator/app_prop.decorator';
import { SchemaTypes } from 'mongoose';
import StockUnit from '../stock_unit/stock_unit.schema';
import PriceAdjustment from '../price_adjustment/price_adjustment.schema';
import { ProductVariant } from '../product_variant/product_variant.schema';
import { Sale } from '../sale/sale.schema';

@Schema()
export class ProductSale extends BaseSchema {
   //TODO: validate all unit must be same product variant
   @AppProp({ type: [{ type: SchemaTypes.ObjectId, ref: 'SockUnit' }] })
   stockUnits: Array<AppSchema<StockUnit>>;

   @AppProp({ type: SchemaTypes.ObjectId, ref: 'ProductVariant' })
   productVariant: AppSchema<ProductVariant>;

   //TODO: pending -> false on sale resolved
   @AppProp({ type: Boolean, default: true, immutable: false })
   isPending: boolean;

   @AppProp({ type: Number })
   unitPrice: number;

   @AppProp({ type: Number })
   totalPrice: number;

   @AppProp({ type: Number })
   finalUnitPrice: number;

   @AppProp({ type: Number })
   finalTotalPrice: number;

   @AppProp({ type: SchemaTypes.ObjectId, ref: 'PriceAdjustment' })
   appliedAdjustment?: PriceAdjustment;

   @AppProp({ type: SchemaTypes.ObjectId, ref: 'Sale' })
   sale: AppSchema<Sale>;
}
