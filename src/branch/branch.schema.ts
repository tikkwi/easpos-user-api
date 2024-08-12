import { Schema } from '@nestjs/mongoose';
import { BaseSchema } from '@common/schema/base.schema';
import { AppProp } from '@common/decorator/app_prop.decorator';
import { SchemaTypes } from 'mongoose';
import { Address } from '@shared/address/address.schema';
import { IsEmail, IsPhoneNumber } from 'class-validator';
import { EStatus } from '@common/utils/enum';
import { Type } from 'class-transformer';
import { Status } from '@common/dto/entity.dto';
import { Merchant } from '@common/schema/merchant.schema';

@Schema()
export class Branch extends BaseSchema {
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
