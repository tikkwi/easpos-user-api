import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '@common/schema/user.schema';
import { AppProp } from '@common/decorator/app_prop.decorator';
import { SchemaTypes } from 'mongoose';
import { Merchant } from '@common/schema/merchant.schema';

@Schema()
export class Partner extends User {
   @AppProp({ type: SchemaTypes.ObjectId, ref: 'Merchant' })
   merchant: Merchant;
}

export const PartnerSchema = SchemaFactory.createForClass(Partner);
