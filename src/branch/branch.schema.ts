import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { IsEmail, IsPhoneNumber } from 'class-validator';
import { Type } from 'class-transformer';
import BaseSchema from '@common/core/base.schema';
import AppProp from '@common/decorator/app_prop.decorator';
import Address from '@shared/address/address.schema';
import { EStatus } from '@common/utils/enum';
import { Status } from '@common/dto/entity.dto';

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
   address: Address;

   @AppProp({ type: SchemaTypes.Mixed, immutable: false, default: { status: EStatus.Pending } })
   @Type(() => Status)
   status: Status;

   @AppProp({ type: SchemaTypes.ObjectId, ref: 'Merchant' })
   merchant: Merchant;
}

export const BranchSchema = SchemaFactory.createForClass(Branch);
