import { Schema, SchemaFactory } from '@nestjs/mongoose';
import BaseSchema from '@common/core/base.schema';
import AppProp from '@common/decorator/app_prop.decorator';
import { SchemaTypes } from 'mongoose';
import Partner from '../partner/partner.schema';
import {
   IsBoolean,
   IsEnum,
   IsMongoId,
   IsNumber,
   IsOptional,
   ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Amount } from '@common/dto/entity.dto';
import { IntersectionType, OmitType, PickType } from '@nestjs/swagger';
import ProductUnit from '../product_unit/product_unit.schema';
import { EInspectionStatus, EProcurementStatus } from '@common/utils/enum';
import Expense from '../expense/expense.schema';
import Category from '@shared/category/category.schema';

class StockPurchased extends PickType(ProductUnit, [
   'qrCode',
   'unitQuantity',
   'model',
   'serial',
   'metaValue',
]) {
   @IsOptional() //NOTE: can null if new stock
   @IsMongoId()
   stockId?: string;

   @ValidateNested()
   @Type(() => Amount)
   pricePerUnit: Amount;

   @IsEnum(EInspectionStatus)
   inspectionStatus: EInspectionStatus;
}

class StockBatch {
   @ValidateNested()
   @Type(() => StockPurchased)
   stock: StockPurchased;

   @IsNumber()
   totalUnit: number;

   @ValidateNested()
   @Type(() => Amount)
   totalPrice: Amount;

   @IsBoolean()
   inspectionCompleted: boolean;

   @AppProp({ type: String, required: false })
   remark?: string;
}

@Schema()
export default class Procurement extends IntersectionType(
   BaseSchema,
   OmitType(StockBatch, ['stock', 'totalUnit']),
) {
   @AppProp({ type: SchemaTypes.ObjectId, ref: 'Partner' })
   supplier: Partner;

   @AppProp({ type: [SchemaTypes.Mixed] }, { type: StockBatch })
   batches: StockBatch[];

   @AppProp({ type: String, enum: EProcurementStatus })
   status: EProcurementStatus;

   @AppProp({ type: Date })
   receivedDate: Date;

   @AppProp({ type: SchemaTypes.ObjectId, ref: 'Category' })
   category: Category;

   @AppProp({ type: [{ type: SchemaTypes.ObjectId, ref: 'Expense' }] })
   expenses: Expense[];
}

export const ProcurementSchema = SchemaFactory.createForClass(Procurement);
