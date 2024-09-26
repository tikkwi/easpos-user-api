import { SchemaTypes } from 'mongoose';
import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { MerchantUserRole } from '../merchant_user_role/merchant_user_role.schema';
import User from '@shared/user/user.schema';
import AppProp from '@common/decorator/app_prop.decorator';

@Schema()
export default class MerchantUser extends User {
   @AppProp({ type: SchemaTypes.ObjectId, ref: 'MerchantUserRole' })
   role: MerchantUserRole;

   @AppProp({ type: Boolean, default: true })
   allowSellerApp?: boolean;

   @AppProp({ type: Boolean, default: false })
   allowAdminApp?: boolean;

   @AppProp({ type: SchemaTypes.ObjectId, ref: 'Merchant' })
   merchant: Merchant;
}

export const MerchantUserSchema = SchemaFactory.createForClass(MerchantUser);
