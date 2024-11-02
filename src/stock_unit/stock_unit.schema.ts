import BaseSchema from '@common/core/base.schema';
import AppProp from '@common/decorator/app_prop.decorator';
import { SchemaTypes } from 'mongoose';
import Category from '@shared/category/category.schema';
import { EProductUnitStatus } from '@common/utils/enum';
import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { ProductVariant } from '../product_variant/product_variant.schema';
import { Amount } from '@common/dto/entity.dto';
import Procurement from '../procurement/procurement.schema';
import { ValidateIf } from 'class-validator';
import Ingredient from '../ingredient/ingredient.schema';
import StockLocation from '../stock_location/stock_location.schema';
import Section from '../section/section.schema';
import Shelf from '../shelf/shelf.schema';

@Schema()
export default class StockUnit extends BaseSchema {
   @AppProp({ type: String, unique: true, required: false })
   qrCode?: string;

   //NOTE: by merchant's inspection passed not supplier or product's qc passed status
   @AppProp({ type: Boolean, default: false })
   isQcPassed: boolean;

   @AppProp({ type: SchemaTypes.Mixed }, { type: Amount })
   unitQuantity: Amount;

   @AppProp({ type: Boolean })
   isIngredient: boolean;

   @AppProp({ type: String, required: false })
   model?: string;

   @AppProp({ type: String, required: false })
   serial?: string;

   @AppProp({ type: String, enum: EProductUnitStatus.Available })
   status: EProductUnitStatus;

   @AppProp({ type: [{ type: SchemaTypes.ObjectId, ref: 'Category' }], required: false })
   tags?: AppSchema<Category>[];

   @AppProp({ type: SchemaTypes.Mixed }) //NOTE: manual validation
   metaValue?: any;

   @ValidateIf((o) => !o.isIngredient)
   @AppProp({ type: SchemaTypes.ObjectId, ref: 'ProductVariant' })
   product?: ProductVariant;

   @ValidateIf((o) => o.isIngredient)
   @AppProp({ type: SchemaTypes.ObjectId, ref: 'Ingredient' })
   ingredient?: Ingredient;

   @AppProp({ type: SchemaTypes.ObjectId, ref: 'Procurement' })
   batch: Procurement;

   @AppProp({ type: SchemaTypes.ObjectId, ref: 'StockLocation' })
   stockLocation: StockLocation;

   @AppProp({ type: SchemaTypes.ObjectId, ref: 'Section' })
   section: Section;

   @AppProp({ type: SchemaTypes.ObjectId, ref: 'Shelf' })
   shelf: Shelf;
}

export const StockUnitSchema = SchemaFactory.createForClass(StockUnit);
