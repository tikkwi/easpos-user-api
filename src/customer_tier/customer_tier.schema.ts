import { Schema, SchemaFactory } from '@nestjs/mongoose';
import AppProp from '@common/decorator/app_prop.decorator';
import BaseSchema from '@common/core/base/base.schema';
import { IsBoolean, IsOptional, IsString, Max, Min, ValidateIf } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { IsPeriod } from '@common/validator';

class TierBenefit {
   @IsString()
   name: string;

   @IsString()
   description: string;

   @IsBoolean()
   isCouponReward: boolean;

   @ValidateIf((o) => o.isCouponReward)
   @IsOptional()
   @IsString()
   coupon?: string;

   @ValidateIf((o) => !o.isCouponReward)
   @IsString({ each: true })
   permissions?: Array<string>;
}

@Schema()
export default class CustomerTier extends BaseSchema {
   @AppProp({ type: String })
   name: string;

   @AppProp({ type: Number })
   pointRequired: number;

   @AppProp({ type: String, required: false })
   description?: string;

   //TODO: need manual validation not to misaligned other tiers
   @AppProp({ type: Number })
   @Min(1)
   @Max(100)
   level: number;

   @AppProp({ type: SchemaTypes.Mixed, required: false }, { validators: [{ func: IsPeriod }] })
   sustainPeriod?: string;

   @AppProp({ type: String, required: false })
   icon?: string;

   @AppProp({ type: [SchemaTypes.Mixed] }, { type: TierBenefit })
   benefits: TierBenefit[];
}

export const CustomerTierSchema = SchemaFactory.createForClass(CustomerTier);
