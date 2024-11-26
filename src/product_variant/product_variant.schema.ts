import Product, { BaseProduct } from '../product/product.schema';
import AppProp from '@common/decorator/app_prop.decorator';
import { SchemaTypes } from 'mongoose';
import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { IntersectionType, OmitType, PartialType, PickType } from '@nestjs/swagger';
import { Amount } from '@common/dto/entity.dto';
import Category from '@shared/category/category.schema';

@Schema()
export class ProductVariant extends IntersectionType(
   OmitType(BaseProduct, ['name']),
   PartialType(PickType(BaseProduct, ['name'])),
) {
   @AppProp({ type: Boolean })
   default: boolean;

   @AppProp({ type: SchemaTypes.ObjectId, ref: 'Product' })
   product: Product;

   @AppProp({ type: SchemaTypes.Mixed }) //NOTE: manual validation
   metaValue?: any;

   //NOTE: price must be based on base unit
   @AppProp({ type: SchemaTypes.Mixed, required: false }, { type: Amount })
   basePrice?: Amount;

   @AppProp({ type: [{ type: SchemaTypes.ObjectId, ref: 'Category' }], default: [] })
   tags?: Array<AppSchema<Category>>;
}

export const ProductVariantSchema = SchemaFactory.createForClass(ProductVariant);
