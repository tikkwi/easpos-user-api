import Product, { BaseProduct, Ingredient } from '../product/product.schema';
import AppProp from '@common/decorator/app_prop.decorator';
import { SchemaTypes } from 'mongoose';
import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { IntersectionType, OmitType, PartialType, PickType } from '@nestjs/swagger';
import { Amount } from '@common/dto/entity.dto';
import { IsRecord } from '@common/validator/is_record.validator';
import { EType } from '@common/utils/enum';

@Schema()
export class ProductVariant extends IntersectionType(
   OmitType(BaseProduct, ['name']),
   PartialType(PickType(BaseProduct, ['name'])),
) {
   //TODO: must validate with product meta's key
   @AppProp({ type: String })
   type: string;

   @AppProp({ type: Boolean })
   default: boolean;

   @AppProp({ type: SchemaTypes.ObjectId, ref: 'Product' })
   product: Product;

   @AppProp({ type: SchemaTypes.Mixed }, { validators: [{ func: IsRecord, args: [EType.String] }] })
   metaValue?: Record<string, any>;

   //NOTE: price must be based on base unit
   @AppProp({ type: SchemaTypes.Mixed, required: false }, { type: Amount })
   basePrice?: Amount;

   /**
    * TODO: validate these(excludedIngredient, addedIngredient) only if product is in-house
    * Is we need to modify blend amount of ingredient, we must exclude first and include in added
    * Validate excluded ingredient must be in product's ingredients
    */
   @AppProp({ type: [SchemaTypes.Mixed] }, { type: Ingredient })
   excludedIngredients?: Array<Ingredient>;

   @AppProp({ type: [SchemaTypes.Mixed] }, { type: Ingredient })
   addedIngredients?: Array<Ingredient>;
}

export const ProductVariantSchema = SchemaFactory.createForClass(ProductVariant);
