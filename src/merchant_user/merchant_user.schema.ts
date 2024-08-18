import { User } from '@common/schema/user.schema';
import { AppProp } from '@common/decorator/app_prop.decorator';
import { SchemaTypes } from 'mongoose';
import { Merchant } from '@common/schema/merchant.schema';
import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { MerchantUserRole } from '../merchant_user_role/merchant_user_role.schema';

@Schema()
export class MerchantUser extends User {
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
