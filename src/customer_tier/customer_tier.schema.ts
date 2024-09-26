import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { Type } from 'class-transformer';
import { Allowance } from '../allowance/allowance.schema';
import AppProp from '@common/decorator/app_prop.decorator';

@Schema()
export default class CustomerTier {
   @AppProp({ type: String })
   name: string;

   @AppProp({ type: String })
   description: string;

   @AppProp({ type: String, required: false })
   icon?: string;

   @AppProp({ type: Boolean, default: false })
   isBaseTier: boolean;

   @AppProp({ type: SchemaTypes.Mixed, required: false })
   @Type(() => Allowance)
   reward?: Allowance;

   @AppProp({ type: SchemaTypes.ObjectId, ref: 'CustomerTier', required: false })
   nextTier?: CustomerTier;

   @AppProp({ type: SchemaTypes.ObjectId, ref: 'Merchant' })
   merchant: Merchant;
}

export const CustomerTierSchema = SchemaFactory.createForClass(CustomerTier);
