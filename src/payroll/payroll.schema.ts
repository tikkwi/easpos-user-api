import { Schema, SchemaFactory } from '@nestjs/mongoose';
import BaseSchema from '@common/core/base.schema';
import AppProp from '@common/decorator/app_prop.decorator';
import { SchemaTypes } from 'mongoose';
import { Amount } from '@common/dto/entity.dto';
import { PayrollAdjustment } from '../payroll_adjustment/payroll_adjustment.schema';
import Employee from '../employee/employee.schema';
import { EStatus } from '@common/utils/enum';

@Schema()
export default class Payroll extends BaseSchema {
   @AppProp({ type: SchemaTypes.Mixed }, { type: Amount })
   baseSalary: Amount;

   @AppProp({ type: String, enum: EStatus })
   status: EStatus;

   @AppProp({ type: [{ type: SchemaTypes.ObjectId, ref: 'User' }] })
   adjustments: PayrollAdjustment[];

   @AppProp({ type: SchemaTypes.ObjectId, ref: 'Employee' })
   employee: Employee;

   @AppProp({ type: SchemaTypes.ObjectId, ref: 'Employee' })
   paidBy: Employee;

   @AppProp({ type: SchemaTypes.ObjectId, ref: 'Employee' })
   approvedBy: Employee;

   @AppProp({ type: String })
   remark?: string;
}

export const PayrollSchema = SchemaFactory.createForClass(Payroll);
