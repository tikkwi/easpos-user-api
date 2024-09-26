import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { CustomerTier } from '../customer_tier/customer_tier.schema';
import { Type } from 'class-transformer';
import { AllowanceBenefit } from '../allowance/allowance.schema';
import { IsMongoId, IsOptional, ValidateNested } from 'class-validator';
import User from '@shared/user/user.schema';
import AppProp from '@common/decorator/app_prop.decorator';

class CustomerDiscount {
   @ValidateNested()
   @Type(() => AllowanceBenefit)
   discount: AllowanceBenefit;

   @IsOptional()
   @IsMongoId()
   usage: string; //NOTE: AuditLog
}

class AccumulatedAllowance {}

@Schema()
export default class Customer extends User {
   @AppProp({ type: SchemaTypes.ObjectId, ref: 'CustomerTier', required: false })
   tier?: CustomerTier;

   @AppProp({ type: SchemaTypes.ObjectId, ref: 'Merchant' })
   merchant: Merchant;

   @AppProp({ type: SchemaTypes.Mixed, required: false })
   @Type(() => AllowanceBenefit)
   point: AllowanceBenefit[];

   @AppProp({ type: SchemaTypes.Mixed, required: false })
   @Type(() => AllowanceBenefit)
   cash: AllowanceBenefit[];

   @AppProp({ type: SchemaTypes.Mixed, required: false })
   @Type(() => CustomerDiscount)
   discounts: CustomerDiscount[];
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
