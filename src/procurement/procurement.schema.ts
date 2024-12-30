import { Schema, SchemaFactory } from '@nestjs/mongoose';
import BaseSchema from '@common/core/base/base.schema';
import AppProp from '@common/decorator/app_prop.decorator';
import { SchemaTypes } from 'mongoose';
import Partner from '../partner/partner.schema';
import { IsEnum, IsMongoId, IsNumber, ValidateIf, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Amount, FieldValue } from '@common/dto/entity.dto';
import { IntersectionType, OmitType, PickType } from '@nestjs/swagger';
import { EInspectionStatus, EProcurementStatus } from '@common/utils/enum';
import Expense from '../expense/expense.schema';
import Product from '../product/product.schema';

export class SupplierStock extends PickType(Product, ['unit', 'unitQuantity']) {
   @ValidateIf((o) => !o.metaValue) //NOTE: can null if new stock
   @IsMongoId()
   stockVariantId?: string;

   @ValidateNested()
   @Type(() => Amount)
   pricePerUnit: Amount;

   @IsMongoId() //NOTE: category (SupplierStock)
   type: string;

   @ValidateIf((o) => !o.stockId) //NOTE: can null if new stock
   @ValidateNested({ each: true })
   @Type(() => FieldValue)
   metaValue?: Array<FieldValue>;
}

export class SupplierStockBatch {
   @ValidateNested()
   @Type(() => SupplierStock)
   stock: SupplierStock;

   @IsNumber()
   totalUnit: number;

   @ValidateNested()
   @Type(() => Amount)
   totalPrice: Amount;

   @IsEnum(EInspectionStatus)
   inspectionStatus: EInspectionStatus;

   @AppProp({ type: String, required: false })
   remark?: string;
}

@Schema()
export default class Procurement extends IntersectionType(
   BaseSchema,
   OmitType(SupplierStockBatch, ['stock', 'totalUnit']),
) {
   @AppProp({ type: SchemaTypes.ObjectId, ref: 'Partner' })
   supplier: Partner;

   @AppProp({ type: [SchemaTypes.Mixed] }, { type: SupplierStockBatch })
   batches: Array<SupplierStockBatch>;

   @AppProp({ type: String, enum: EProcurementStatus, default: EProcurementStatus.Pending })
   status?: EProcurementStatus;

   @AppProp({ type: Date })
   receivedDate: Date;

   @AppProp({ type: [{ type: SchemaTypes.ObjectId, ref: 'Expense' }] })
   expenses: Array<Expense>;
}

export const ProcurementSchema = SchemaFactory.createForClass(Procurement);
