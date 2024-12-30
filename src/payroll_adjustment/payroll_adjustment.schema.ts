import { Schema, SchemaFactory } from '@nestjs/mongoose';
import BaseSchema from '@common/core/base/base.schema';
import AppProp from '@common/decorator/app_prop.decorator';
import { SchemaTypes } from 'mongoose';
import { Amount } from '@common/dto/entity.dto';
import Category from '@shared/category/category.schema';

@Schema()
export class PayrollAdjustment extends BaseSchema {
   @AppProp({ type: String })
   name: string;

   @AppProp({ type: String, required: false })
   description?: string;

   @AppProp({ type: SchemaTypes.Mixed }, { type: Amount })
   amount: Amount;

   @AppProp({ type: SchemaTypes.ObjectId, ref: 'Category' })
   category: Category;

   @AppProp({ type: Boolean })
   deduction: boolean;

   @AppProp({ type: Boolean })
   recurring: boolean;
}

export const PayrollAdjustmentSchema = SchemaFactory.createForClass(PayrollAdjustment);
