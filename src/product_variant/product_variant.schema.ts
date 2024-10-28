import Product, { BaseProduct, PriceVariant } from '../product/product.schema';
import AppProp from '@common/decorator/app_prop.decorator';
import { SchemaTypes } from 'mongoose';
import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { IntersectionType, OmitType, PartialType, PickType } from '@nestjs/swagger';
import { Amount } from '@common/dto/entity.dto';

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

   @AppProp({ type: SchemaTypes.Mixed, required: false }, { type: Amount })
   basePrice?: Amount;

   @AppProp({ type: [SchemaTypes.Mixed], required: false }, { type: PriceVariant })
   tagPrices?: PriceVariant[];
}

export const ProductVariantSchema = SchemaFactory.createForClass(ProductVariant);
