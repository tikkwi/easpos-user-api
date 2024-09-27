import { IsBoolean, IsEnum, IsMongoId, IsNumber, IsOptional, ValidateIf } from 'class-validator';
import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { EAllowance, EMerchantAllowanceBenefit } from '@common/utils/enum';
import AppProp from '@common/decorator/app_prop.decorator';
import { SchemaTypes } from 'mongoose';
import Allowance from '@shared/allowance/allowance.schema';
import CustomerTier from '../customer_tier/customer_tier.schema';

export class AllowanceBenefit {
   @IsEnum(EMerchantAllowanceBenefit)
   type: EMerchantAllowanceBenefit;

   @ValidateIf((o) => o.type === EMerchantAllowanceBenefit.Discount)
   @IsBoolean()
   isAbsolute?: boolean;

   @IsNumber()
   amount: number;

   @IsOptional()
   @IsBoolean()
   bypassExtendability?: boolean; //NOTE: can bypass if point can extend in merchant config, true mean these point won't extendable if even allowed by config

   @ValidateIf((o) => o.type === EMerchantAllowanceBenefit.Product)
   @IsMongoId()
   product?: string;

   @ValidateIf((o) => o.type === EMerchantAllowanceBenefit.Discount)
   @IsMongoId({ each: true })
   discountedProducts?: string[];

   @ValidateIf((o) => o.type === EMerchantAllowanceBenefit.Discount)
   @IsMongoId({ each: true })
   discountedProductTypes?: string[];

   @ValidateIf((o) => o.type === EMerchantAllowanceBenefit.Discount)
   @IsMongoId({ each: true })
   discountedProductTags?: string[];
}

//TODO: delete customer's accumulated allowances also if deleted
@Schema()
export default class MerchantAllowance extends Allowance {
   @AppProp({ type: SchemaTypes.Mixed }, { type: AllowanceBenefit })
   benefit: AllowanceBenefit;

   @AppProp({ type: String, enum: EAllowance })
   type: EAllowance;

   @AppProp({ type: [{ type: SchemaTypes.ObjectId, ref: 'CustomerTier' }] })
   declare tierTrigger: AppSchema<CustomerTier>[];
}

export const MerchantAllowanceSchema = SchemaFactory.createForClass(MerchantAllowance);
