import { Schema } from '@nestjs/mongoose';
import BaseSchema from '@common/core/base.schema';
import { IntersectionType, OmitType } from '@nestjs/swagger';
import { ProductSale } from '../product_sale/product_sale.schema';
import AppProp from '@common/decorator/app_prop.decorator';
import { SchemaTypes } from 'mongoose';
import Unit from '@shared/unit/unit.schema';
import Category from '@shared/category/category.schema';

@Schema()
export class Sale extends IntersectionType(
   BaseSchema,
   OmitType(ProductSale, ['isPending', 'appliedAdjustment']),
) {
   @AppProp({ type: Number })
   price: number;

   @AppProp({ type: Number })
   finalPrice: number;

   @AppProp({ type: [{ type: SchemaTypes.ObjectId, ref: 'ProductSale' }] })
   products: Array<AppSchema<ProductSale>>;

   @AppProp({ type: SchemaTypes.ObjectId, ref: 'Unit' })
   currency: AppSchema<Unit>;

   @AppProp({ type: SchemaTypes.ObjectId, ref: 'Category' })
   paymentMethod: AppSchema<Category>;
}
