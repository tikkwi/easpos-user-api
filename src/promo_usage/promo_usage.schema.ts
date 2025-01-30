import { Schema, SchemaFactory } from '@nestjs/mongoose';
import BaseSchema from '@common/core/base/base.schema';
import AppProp from '@common/decorator/app_prop.decorator';
import { SchemaTypes } from 'mongoose';
import PromoCode from '../promo_code/promo_code.schema';
import Customer from '../customer/customer.schema';

@Schema()
export default class PromoUsage extends BaseSchema {
   @AppProp({ type: SchemaTypes.ObjectId, ref: 'PromoCode' })
   promoCode: PromoCode;

   @AppProp({ type: SchemaTypes.ObjectId, ref: 'Sale' })
   sale: PromoCode;

   @AppProp({ type: SchemaTypes.ObjectId, ref: 'Customer' })
   customer: Customer;
}

export const PromoUsageSchema = SchemaFactory.createForClass(PromoUsage);
