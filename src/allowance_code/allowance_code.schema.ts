import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { EUser } from '@common/utils/enum';
import { ValidateIf } from 'class-validator';
import BaseSchema from '@common/core/base.schema';
import AppProp from '@common/decorator/app_prop.decorator';

@Schema()
export class AllowanceCode extends BaseSchema {
   @AppProp({ type: String, unique: true })
   code: string;

   @AppProp({ type: Date, required: false })
   expireAt: Date;

   @AppProp({ type: SchemaTypes.ObjectId, ref: 'Allowance' })
   allowance: AppSchema<Allowance>;

   //NOTE: for the referral program
   @AppProp({ type: Boolean, required: false })
   isMerchantReferral?: EUser;

   @ValidateIf((o) => o.userType !== undefined)
   @AppProp({ type: SchemaTypes.ObjectId })
   user: any; //Merchant User / Customer
}

export const AllowanceCodeSchema = SchemaFactory.createForClass(AllowanceCode);
