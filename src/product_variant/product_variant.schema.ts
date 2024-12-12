import Product, { BaseProduct } from '../product/product.schema';
import AppProp from '@common/decorator/app_prop.decorator';
import { SchemaTypes } from 'mongoose';
import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { IntersectionType, OmitType, PartialType, PickType } from '@nestjs/swagger';
import { Amount, FieldValue } from '@common/dto/entity.dto';

@Schema()
export class ProductVariant extends IntersectionType(
   OmitType(BaseProduct, ['name']),
   PartialType(PickType(BaseProduct, ['name'])),
) {
   @AppProp({ type: Boolean })
   default: boolean;

   @AppProp({ type: SchemaTypes.ObjectId, ref: 'Product' })
   product: Product;

   @AppProp({ type: [SchemaTypes.Mixed] }, { type: FieldValue }) //NOTE: manual validation
   metaValue?: Array<FieldValue>;

   //NOTE: price must be based on base unit
   @AppProp({ type: SchemaTypes.Mixed, required: false }, { type: Amount })
   basePrice?: Amount;
}

export const ProductVariantSchema = SchemaFactory.createForClass(ProductVariant);
