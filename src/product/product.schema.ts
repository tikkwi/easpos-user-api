import { IsBoolean, IsMongoId, IsNumber, IsOptional, Max, Min, ValidateIf } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import BaseSchema from '@common/core/base/base.schema';
import AppProp from '@common/decorator/app_prop.decorator';
import Category from '@shared/category/category.schema';
import { EProduct, EProductStatus, EType } from '@common/utils/enum';
import { Schema, SchemaFactory } from '@nestjs/mongoose';
import Unit from '@shared/unit/unit.schema';
import { IsRecord } from '@common/validator/is_record.validator';

export class PriceVariant {
   @IsMongoId() //NOTE:tag category
   id: string;

   @IsNumber({ maxDecimalPlaces: 2 })
   @Min(0.01)
   @Max(0.99)
   baseMultiplier: number;

   @IsBoolean() //NOTE:is stackable to promotion
   isStackable: boolean;

   @IsOptional()
   @IsBoolean()
   foc?: boolean;

   @ValidateIf((o) => o.foc)
   @IsNumber()
   focQuantity?: number;
}

export class Ingredient {
   @IsMongoId()
   productId: string;

   @IsNumber()
   blendAmount: number;
}

export class BaseProduct extends BaseSchema {
   @AppProp({ type: String })
   name: string;

   @AppProp({ type: String, required: false })
   description?: string;

   @AppProp({ type: [String], required: false })
   attachments?: string[];

   @AppProp({ type: [{ type: SchemaTypes.ObjectId, ref: 'Category' }], default: [] })
   tags?: Array<AppSchema<Category>>;
}

@Schema()
export default class Product extends BaseProduct {
   @AppProp({ type: String, enum: EProduct })
   type: EProduct;

   @AppProp({ type: Boolean })
   isInHouse: boolean;

   @AppProp({ type: Boolean })
   isIngredient: boolean;

   @AppProp({ type: [String], enum: EProductStatus })
   statuses: EProductStatus[];

   @AppProp({ type: SchemaTypes.ObjectId, ref: 'Category' })
   category: AppSchema<Category>;

   @AppProp({ type: SchemaTypes.ObjectId, ref: 'Unit' })
   unit: AppSchema<Unit>;

   @AppProp({ type: Number })
   unitQuantity: number;

   /*
    * unitQuantity is how much unit include in a single stock unit
    * eg. let say 1 unit of grape => 1 viss
    *
    * minUnit is the least possible unit that can sell. if stock_unit only left
    * less than minUnit, stock out.
    * eg. grape can sell minimum of 0.1 unit (0.1 viss)
    * */
   @AppProp({ type: Number })
   @Min(0.001)
   @Max(0.9)
   minUnit: number;

   @AppProp({ type: [SchemaTypes.Mixed] }, { type: PriceVariant })
   priceVariants: Array<PriceVariant>;

   //TODO: validate meta in variant (type field in variant schema) with key with product
   @AppProp(
      { type: SchemaTypes.Mixed },
      {
         validators: [
            {
               func: IsRecord,
               args: [EType.String, EType.String, true],
            },
         ],
      },
   )
   meta: Record<string, Array<string>>;

   @ValidateIf((o) => o.isInHouse)
   @AppProp({ type: [SchemaTypes.Mixed] }, { type: Ingredient })
   ingredients?: Ingredient[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
