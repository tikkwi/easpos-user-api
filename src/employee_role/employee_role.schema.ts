import { Schema, SchemaFactory } from '@nestjs/mongoose';
import AppProp from '@common/decorator/app_prop.decorator';
import BaseSchema from '@common/core/base/base.schema';
import { SchemaTypes } from 'mongoose';
import { EmployeeConfig } from '../employee/employee.schema';
import Category from '@shared/category/category.schema';

//NOTE:  all config here can be overwritten at specific employee level
@Schema()
export default class EmployeeRole extends BaseSchema {
   @AppProp({ type: SchemaTypes.ObjectId, ref: 'Category' })
   category: Category;

   @AppProp({ type: SchemaTypes.Mixed }, { type: EmployeeConfig })
   config: EmployeeConfig;
}

export const EmployeeRoleSchema = SchemaFactory.createForClass(EmployeeRole);
