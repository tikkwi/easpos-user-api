import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { AppProp } from '@common/decorator/app_prop.decorator';
import { ValidateIf } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { Type } from 'class-transformer';
import { UserRole } from '@common/dto/entity.dto';
import { Merchant } from '@common/schema/merchant.schema';

@Schema()
export class MerchantUserRole {
   @ValidateIf((o) => !o.isOwner)
   @AppProp({ type: SchemaTypes.Mixed })
   @Type(() => UserRole)
   role?: UserRole;

   @AppProp({ type: Boolean, default: false, required: false })
   isOwner: boolean;

   @ValidateIf((o) => !o.isOwner)
   @AppProp({ type: Number })
   basicSalary?: number;

   @AppProp({ type: SchemaTypes.ObjectId, ref: 'Merchant' })
   merchant: Merchant;
}

export const MerchantUserRoleSchema = SchemaFactory.createForClass(MerchantUserRole);
