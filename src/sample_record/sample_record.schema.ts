import { Schema, SchemaFactory } from '@nestjs/mongoose';
import BaseSchema from '@common/core/base.schema';
import AppProp from '@common/decorator/app_prop.decorator';
import { SchemaTypes } from 'mongoose';
import StockUnit from '../stock_unit/stock_unit.schema';

@Schema()
export default class SampleRecord extends BaseSchema {
   @AppProp({ type: Boolean })
   isPassed: boolean;

   @AppProp({ type: [String], required: false })
   issues?: string[];

   @AppProp({ type: String, required: false })
   remark?: string;

   @AppProp({ type: SchemaTypes.ObjectId, ref: 'StockUnit' })
   stock: StockUnit;
}

export const SampleRecordSchema = SchemaFactory.createForClass(SampleRecord);
