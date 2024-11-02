import { Schema, SchemaFactory } from '@nestjs/mongoose';
import BaseSchema from '@common/core/base.schema';
import AppProp from '@common/decorator/app_prop.decorator';
import { SchemaTypes } from 'mongoose';
import Category from '@shared/category/category.schema';
import { EInspectionStatus } from '@common/utils/enum';
import SampleRecord from '../sample_record/sample_record.schema';

@Schema()
export default class Inspection extends BaseSchema {
   @AppProp({ type: String, enum: EInspectionStatus })
   status: EInspectionStatus;

   @AppProp({ type: Number })
   sampleSize: number;

   @AppProp({ type: String, required: false })
   remark?: string;

   @AppProp({ type: SchemaTypes.ObjectId, ref: 'Category' })
   type: Category;

   @AppProp({ type: [{ type: SchemaTypes.ObjectId, ref: 'SampleRecord' }] })
   samples: SampleRecord[];
}

export const InspectionSchema = SchemaFactory.createForClass(Inspection);
