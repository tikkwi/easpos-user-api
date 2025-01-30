import { Schema, SchemaFactory } from '@nestjs/mongoose';
import BaseSchema from '@common/core/base/base.schema';
import AppProp from '@common/decorator/app_prop.decorator';
import { SchemaTypes } from 'mongoose';
import StockUnit from '../stock_unit/stock_unit.schema';
import { ProductVariant } from '../product_variant/product_variant.schema';
import { Sale } from '../sale/sale.schema';

@Schema()
export class ProductSale extends BaseSchema {
   //TODO: validate all unit must be same product variant
   @AppProp({ type: [{ type: SchemaTypes.ObjectId, ref: 'SockUnit' }] })
   stockUnits: Array<StockUnit>;

   @AppProp({ type: SchemaTypes.ObjectId, ref: 'ProductVariant' })
   productVariant: ProductVariant;

   @AppProp({ type: Number })
   baseUnitPrice: number;

   @AppProp({ type: Number })
   paidUnitPrice: number;

   @AppProp({ type: SchemaTypes.ObjectId, ref: 'Sale' })
   sale: Sale;
}

export const ProductSaleSchema = SchemaFactory.createForClass(ProductSale);
