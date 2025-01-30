import AppProp from '@common/decorator/app_prop.decorator';
import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { EDiscount } from '@common/utils/enum';
import { ValidateIf } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import Category from '@shared/category/category.schema';
import { Amount } from '@common/dto/entity.dto';
import { StockDto } from '../stock_unit/stock_unit.dto';
import Employee from '../employee/employee.schema';

@Schema()
export default class Discount {
   @AppProp({ type: String })
   name: string;

   @AppProp({ type: String, required: false })
   description?: string;

   @AppProp({ type: String, enum: EDiscount })
   type: EDiscount;

   //TODO: manual validate wrt type
   @ValidateIf((o) => o.type !== EDiscount.FOC)
   @AppProp({ type: Number, required: false })
   defaultCashAllowance?: number;

   //TODO: manual validate wrt type
   @ValidateIf((o) => o.type !== EDiscount.FOC)
   @AppProp({ type: Number, required: false })
   maxCashAllowance?: number;

   @ValidateIf((o) => o.type === EDiscount.FOC)
   @AppProp({ type: SchemaTypes.Mixed }, { type: StockDto })
   defaultFoc: StockDto;

   @ValidateIf((o) => o.type === EDiscount.FOC)
   @AppProp({ type: [{ type: SchemaTypes.ObjectId, ref: 'Category' }] })
   allowedFocProductTags: Array<Category>;

   //NOTE: array becz different amount per unit
   @ValidateIf((o) => o.type === EDiscount.FOC)
   @AppProp({ type: [SchemaTypes.Mixed] }, { type: Amount })
   maxAllowedFocAmounts: Array<Amount>;

   @AppProp({ type: SchemaTypes.ObjectId, ref: 'Employee', default: [] })
   applicableEmployees: Array<Employee>;
}

export const DiscountSchema = SchemaFactory.createForClass(Discount);
