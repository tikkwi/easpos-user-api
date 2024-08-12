import { BaseSchema } from '@common/schema/base.schema';
import { AppProp } from '@common/decorator/app_prop.decorator';
import { SchemaTypes } from 'mongoose';
import { EAllowanceTrigger, EAllowanceType } from '@common/utils/enum';
import { IsBoolean, IsEnum, IsMongoId, IsNumber, IsOptional, ValidateIf } from 'class-validator';
import { Type } from 'class-transformer';
import { SchemaFactory } from '@nestjs/mongoose';
import { Branch } from '../branch/branch.schema';

class TriggerProduct {
   @IsMongoId()
   product: string;

   @IsNumber()
   count: number;
}

export class AllowanceBenefit {
   @IsEnum(EAllowanceType)
   type: EAllowanceType;

   @ValidateIf((o) => o.type !== EAllowanceType.Product)
   @IsBoolean()
   isAbsolute?: boolean;

   @IsNumber()
   amount: number;

   @IsOptional()
   @IsBoolean()
   bypassExtendability?: boolean; //NOTE: can bypass if point can extend in merchant config, true mean these point won't extendable if even allowed by config

   @ValidateIf((o) => o.type === EAllowanceType.Product)
   @IsMongoId()
   product?: string;

   @ValidateIf(
      (o) =>
         o.type === EAllowanceType.Discount &&
         !o.discountedProductTypes &&
         !o.discountedProductTags,
   )
   @IsMongoId({ each: true })
   discountedProducts?: string[];

   @ValidateIf(
      (o) =>
         o.type === EAllowanceType.Discount && !o.discountedProducts && !o.discountedProductTags,
   )
   @IsMongoId({ each: true })
   discountedProductTypes?: string[];

   @ValidateIf(
      (o) =>
         o.type === EAllowanceType.Discount && !o.discountedProducts && !o.discountedProductTypes,
   )
   @IsMongoId({ each: true })
   discountedProductTags?: string[];

   @IsOptional()
   @IsMongoId()
   allowance?: string;
}

//NOTE: can also support custom allowance which all discount infos null
export class Allowance extends BaseSchema {
   @AppProp({ type: Number, required: false })
   allowanceCount: number;

   @AppProp({ type: String, required: false })
   title?: string;

   @AppProp({ type: String, required: false })
   description?: string;

   @AppProp({ type: Number, required: false }) //NOTE: mandatory if cus exchange campaign (point shop price)
   price?: number;

   @AppProp({ type: [{ type: SchemaTypes.ObjectId }], required: false }) //NOTE: if cus exchange campaign (null mean can exchange in all branches)
   exchangeableBranches?: Branch[];

   @AppProp({ type: SchemaTypes.Mixed, required: false })
   @Type(() => AllowanceBenefit)
   benefit: AllowanceBenefit;

   @AppProp({ type: Date, required: false })
   expireAt: Date;

   @AppProp({ type: String, enum: EAllowanceTrigger, required: false })
   triggerType: EAllowanceTrigger;

   @ValidateIf((o) => !!o.triggerType && o.triggerType !== EAllowanceTrigger.BuyTogether)
   @AppProp({ type: Number })
   triggerAmount?: number;

   @ValidateIf((o) => !!o.triggerType && o.triggerType === EAllowanceTrigger.BuyTogether)
   @AppProp({ type: [{ type: SchemaTypes.Mixed }] })
   @Type(() => TriggerProduct)
   triggerProducts?: TriggerProduct[];
}

export const AllowanceSchema = SchemaFactory.createForClass(Allowance);
