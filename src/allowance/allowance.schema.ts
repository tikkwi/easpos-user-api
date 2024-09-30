import {
   IsBoolean,
   IsEnum,
   IsMongoId,
   IsNumber,
   IsOptional,
   ValidateIf,
   ValidateNested,
} from 'class-validator';
import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { EAllowance, EMerchantAllowanceBenefit } from '@common/utils/enum';
import AppProp from '@common/decorator/app_prop.decorator';
import { SchemaTypes } from 'mongoose';
import Allowance from '@shared/allowance/allowance.schema';
import CustomerTier from '../customer_tier/customer_tier.schema';
import { Type } from 'class-transformer';

export class ProductAllowance {
   @IsMongoId()
   id: string; //NOTE: this can be product_id, product_tag, product_category

   @IsNumber()
   amount: number;

   @IsOptional()
   @IsMongoId()
   unitId?: string;
}

export class ProductBenefit {
   @ValidateNested({ each: true })
   @Type(() => ProductAllowance)
   products: ProductAllowance[];

   //TODO:to validate allow products with specified unit
   @ValidateNested({ each: true })
   @Type(() => ProductAllowance)
   productTags: ProductAllowance[];

   //TODO:to validate allow products with specified unit
   @ValidateNested({ each: true })
   @Type(() => ProductAllowance)
   productCategories: ProductAllowance[];
}

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
   @ValidateNested({ each: true })
   @Type(() => ProductBenefit)
   products?: ProductBenefit;

   @ValidateIf((o) => o.type === EMerchantAllowanceBenefit.Product)
   @ValidateNested({ each: true })
   @Type(() => ProductBenefit)
   discountedProducts?: ProductBenefit;
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
