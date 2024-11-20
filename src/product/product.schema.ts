import { IsBoolean, IsMongoId, IsNumber, Max, Min, ValidateIf } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import BaseSchema from '@common/core/base.schema';
import AppProp from '@common/decorator/app_prop.decorator';
import Category from '@shared/category/category.schema';
import { EProduct, EProductStatus } from '@common/utils/enum';
import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Amount, Field } from '@common/dto/entity.dto';

export class PriceVariant {
   @IsMongoId() //NOTE:tag category
   id: string;

   @IsNumber({ maxDecimalPlaces: 2 })
   @Min(0.01)
   @Max(0.99)
   baseMultiplier: number;

   @IsBoolean() //NOTE:is stackable to promotion
   isStackable: boolean;

   @ValidateIf((o) => !o.basePrice)
   @IsBoolean()
   foc?: boolean;
}

export class BaseProduct extends BaseSchema {
   @AppProp({ type: String, unique: true }) //NOTE: will only share this.. (qr code is also this)
   refId: string; //NOTE: prod_uuid for product and var_uuid for variant

   @AppProp({ type: String })
   name: string;

   @AppProp({ type: String, required: false })
   description?: string;

   @AppProp({ type: [String], required: false })
   attachments?: string[];

   @AppProp({ type: [{ type: SchemaTypes.ObjectId, ref: 'Category' }], default: [] })
   tags?: AppSchema<Category>[];
}

/*
 * TODO: updating tags in product will apply to all (variant, stock_unit).
 *  updating tags in variant will apply to every associated stock_unit
 * NOTE: everywhere refer to product mean product variant: not barefoot product
 * */

@Schema()
export default class Product extends BaseProduct {
   @AppProp({ type: String, enum: EProduct })
   type: EProduct;

   @AppProp({ type: Boolean })
   inHouse: boolean;

   @AppProp({ type: [String], enum: EProductStatus })
   statuses: EProductStatus[];

   @AppProp({ type: SchemaTypes.ObjectId, ref: 'Category' })
   category: AppSchema<Category>;

   @AppProp({ type: SchemaTypes.Mixed }, { type: Amount })
   unitQuantity: Amount;

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

   @AppProp({ type: SchemaTypes.ObjectId, ref: 'Category' })
   subType: AppSchema<Category>;

   @AppProp({ type: [SchemaTypes.Mixed], required: false }, { type: Field })
   meta?: Field[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
