import { Schema } from '@nestjs/mongoose';
import { OmitType } from '@nestjs/swagger';
import PromoUsage from '../promo_usage/promo_usage.schema';
import AppProp from '@common/decorator/app_prop.decorator';
import { SchemaTypes } from 'mongoose';
import Employee from '../employee/employee.schema';

@Schema()
export default class DiscountUsage extends OmitType(PromoUsage, ['promoCode']) {
   @AppProp({ type: SchemaTypes.ObjectId, ref: 'Employee' })
   appliedEmployee: Employee;
}
