import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import AppProp from '@common/decorator/app_prop.decorator';
import Allowance from '@shared/allowance/allowance.schema';
import BaseSchema from '@common/core/base.schema';

@Schema()
export default class CustomerTier extends BaseSchema {
   @AppProp({ type: String })
   name: string;

   @AppProp({ type: String })
   description: string;

   @AppProp({ type: String, required: false })
   icon?: string;

   @AppProp({ type: Boolean, default: false })
   isBaseTier: boolean;

   @AppProp({ type: SchemaTypes.Mixed, required: false }, { type: Allowance })
   reward?: Allowance;

   @AppProp({ type: SchemaTypes.ObjectId, ref: 'CustomerTier', required: false })
   nextTier?: AppSchema<CustomerTier>;

   @AppProp({ type: SchemaTypes.ObjectId, ref: 'Merchant' })
   merchant: AppSchema<Merchant>;
}

export const CustomerTierSchema = SchemaFactory.createForClass(CustomerTier);
