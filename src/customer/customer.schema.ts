import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import User from '@shared/user/user.schema';
import AppProp from '@common/decorator/app_prop.decorator';
import Allowance from '@shared/allowance/allowance.schema';
import CustomerTier from '../customer_tier/customer_tier.schema';
import { TimedCredit } from '@common/dto/entity.dto';

@Schema()
export default class Customer extends User {
   @AppProp({ type: SchemaTypes.ObjectId, ref: 'CustomerTier', required: false })
   tier?: AppSchema<CustomerTier>;

   @AppProp({ type: SchemaTypes.ObjectId, ref: 'Merchant' })
   merchant: Merchant;

   @AppProp({ type: Number })
   cash: number;

   @AppProp({ type: SchemaTypes.Mixed, required: false }, { type: TimedCredit })
   extensibleCash?: TimedCredit;

   @AppProp({ type: SchemaTypes.Mixed })
   timedCash: Record<number, number>;

   @AppProp({ type: Number })
   point: number;

   @AppProp({ type: SchemaTypes.Mixed, required: false }, { type: TimedCredit })
   extensiblePoint: TimedCredit;

   @AppProp({ type: SchemaTypes.Mixed })
   timedPoint: Record<number, number>;

   @AppProp({ type: [{ type: SchemaTypes.ObjectId, ref: 'MerchantAllowance' }], default: [] })
   allowances: AppSchema<Allowance>[];
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
