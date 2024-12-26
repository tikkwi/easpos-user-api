import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import AppProp from '@common/decorator/app_prop.decorator';
import BaseSchema from '@common/core/base.schema';
import { IsBoolean, IsNumber, IsOptional, IsString, Max, Min, ValidateIf } from 'class-validator';
import { IsAppString } from '@common/validator';
import { CALENDAR_DATE } from '@common/constant';

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

class SustainPoint {
   @IsAppString('include', { arr: CALENDAR_DATE })
   cycleUnit: CalendarDate;

   //TODO: validate max_day -> 30, max_week -> 4, max_month -> 12, max_year -> 10
   @IsNumber()
   @Min(0)
   cycleAmount: number;

   @IsNumber()
   @Min(0)
   pointAmount: number;
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

   @AppProp({ type: SchemaTypes.Mixed, required: false }, { type: SustainPoint })
   sustainPoint?: SustainPoint;

   @AppProp({ type: String, required: false })
   icon?: string;

   @AppProp({ type: [SchemaTypes.Mixed] }, { type: TierBenefit })
   benefits: TierBenefit[];
}

export const CustomerTierSchema = SchemaFactory.createForClass(CustomerTier);
