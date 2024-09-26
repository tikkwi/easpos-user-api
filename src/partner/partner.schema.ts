import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import User from '@shared/user/user.schema';
import AppProp from '@common/decorator/app_prop.decorator';

@Schema()
export default class Partner extends User {
   @AppProp({ type: SchemaTypes.ObjectId, ref: 'Merchant' })
   merchant: Merchant;
}

export const PartnerSchema = SchemaFactory.createForClass(Partner);
