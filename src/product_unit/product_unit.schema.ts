import BaseSchema from '@common/core/base.schema';
import AppProp from '@common/decorator/app_prop.decorator';
import { SchemaTypes } from 'mongoose';
import Category from '@shared/category/category.schema';
import { EProductUnitStatus } from '@common/utils/enum';
import { Schema } from '@nestjs/mongoose';
import { ProductVariant } from '../product_variant/product_variant.schema';
import { Amount } from '@common/dto/entity.dto';
import Procurement from '../procurement/procurement.schema';

@Schema()
export default class ProductUnit extends BaseSchema {
   @AppProp({ type: String, unique: true })
   qrCode: string;

   @AppProp({ type: SchemaTypes.Mixed }, { type: Amount })
   unitQuantity: Amount;

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

   @AppProp({ type: SchemaTypes.ObjectId, ref: 'ProductVariant' })
   product: ProductVariant;

   @AppProp({ type: SchemaTypes.ObjectId, ref: 'Procurement' })
   batch: Procurement;
}
