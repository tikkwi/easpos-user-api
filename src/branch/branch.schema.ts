import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { IsEmail, IsPhoneNumber } from 'class-validator';
import BaseSchema from '@common/core/base/base.schema';
import AppProp from '@common/decorator/app_prop.decorator';
import Address from '@shared/address/address.schema';
import { EStatus } from '@common/utils/enum';

@Schema()
export default class Branch extends BaseSchema {
   @AppProp({ type: String })
   name: string;

   @AppProp({ type: [String] })
   @IsEmail(undefined, { each: true })
   mails: string[];

   @AppProp({ type: [String] })
   @IsPhoneNumber(undefined, { each: true })
   mobileNos: string[];

   @AppProp({ type: SchemaTypes.ObjectId, ref: 'Address' })
   address: AppSchema<Address>;

   @AppProp({ type: String, enum: EStatus, default: EStatus.Active })
   status: EStatus;

   @AppProp({ type: SchemaTypes.ObjectId, ref: 'Merchant' })
   merchant: AppSchema<Merchant>;
}

export const BranchSchema = SchemaFactory.createForClass(Branch);
