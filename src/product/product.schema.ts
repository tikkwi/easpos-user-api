import { IsBoolean, IsMongoId, IsNumber, Max, Min, ValidateIf } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import BaseSchema from '@common/core/base.schema';
import AppProp from '@common/decorator/app_prop.decorator';
import Category from '@shared/category/category.schema';
import { EProduct, EProductStatus } from '@common/utils/enum';
import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Field } from '@common/dto/entity.dto';

export class PriceVariant {
   @IsMongoId() //NOTE: tag
   id: string;

   @IsNumber({ maxDecimalPlaces: 2 })
   @Min(0.01)
   @Max(0.99)
   baseMultiplier: number;

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

   @AppProp({ type: [{ type: SchemaTypes.ObjectId, ref: 'Category' }], required: false })
   tags?: AppSchema<Category>[];
}

//NOTE: everywhere refer to product mean product variant: not barefoot product
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

   @AppProp({ type: SchemaTypes.ObjectId, ref: 'Category', required: false })
   unit?: AppSchema<Category>;

   @AppProp({ type: SchemaTypes.ObjectId, ref: 'Category' })
   subType: AppSchema<Category>;

   @AppProp({ type: [SchemaTypes.Mixed], required: false }, { type: Field })
   meta?: Field[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
