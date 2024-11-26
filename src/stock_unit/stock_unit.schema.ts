import BaseSchema from '@common/core/base.schema';
import AppProp from '@common/decorator/app_prop.decorator';
import { SchemaTypes } from 'mongoose';
import { EProductUnitStatus } from '@common/utils/enum';
import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { ProductVariant } from '../product_variant/product_variant.schema';
import Procurement from '../procurement/procurement.schema';
import { ValidateIf } from 'class-validator';
import Ingredient from '../ingredient/ingredient.schema';
import StockLocation from '../stock_location/stock_location.schema';
import Section from '../section/section.schema';
import Shelf from '../shelf/shelf.schema';
import { OmitType } from '@nestjs/swagger';

/*
 * NOTE: stock_unit is not only the single unit of product_variant.
 * it's also act like batch. so the merchant can sell by only scanning one unit
 * and enter quantity rather than manual scanning every single units.
 * */
@Schema()
export default class StockUnit extends OmitType(BaseSchema, ['createdAt']) {
   @AppProp({ type: Date, default: Date.now, index: true })
   createdAt: Date;

   @AppProp({ type: String, unique: true, required: false })
   barcode?: string;

   //NOTE: by merchant's inspection passed not supplier or product's qc passed status
   @AppProp({ type: Boolean, default: false })
   isQcPassed: boolean;

   //NOTE: mark these stock batch will sell first (these will look first before expireAt and createdAt)
   @AppProp({ type: SchemaTypes.Boolean })
   earlyOut: boolean;

   //NOTE: stock left less than minUnit
   @AppProp({ type: SchemaTypes.Boolean })
   isOutOfStock: boolean;

   //NOTE: must only store unit's base
   @AppProp({ type: Number })
   stockLeft: number;

   @AppProp({ type: Boolean })
   isIngredient: boolean;

   @AppProp({ type: Date, required: false, index: true })
   expireAt?: Date;

   @AppProp({ type: String, required: false })
   model?: string;

   @AppProp({ type: String, required: false })
   serial?: string;

   @AppProp({ type: String, enum: EProductUnitStatus.Available })
   status: EProductUnitStatus;

   @AppProp({ type: SchemaTypes.Mixed }) //NOTE: manual validation
   metaValue?: any;

   @ValidateIf((o) => !o.isIngredient)
   @AppProp({ type: SchemaTypes.ObjectId, ref: 'ProductVariant' })
   productVariant?: AppSchema<ProductVariant>;

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
