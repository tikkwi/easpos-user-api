import { IsMongoId, ValidateIf, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateMerchantRoleDto } from '../merchant_user_role/merchant_user_role.dto';
import { MerchantUserRole } from '../merchant_user_role/merchant_user_role.schema';
import { CreateUserDto } from '@shared/user/user.dto';

class MerchantRoleDto {
   @ValidateIf((o) => !o.role)
   @IsMongoId()
   roleId?: string;

   @ValidateIf((o) => !o.roleId)
   @ValidateNested()
   @Type(() => CreateMerchantRoleDto)
   role?: CreateMerchantRoleDto;
}

export class CreateMerchantUserDto extends CreateUserDto {
   @ValidateIf((o) => !o.merchantId)
   @ValidateNested()
   @Type(() => MerchantRoleDto)
   roleDto?: MerchantUserRole;

   @ValidateIf((o) => !o.role)
   @IsMongoId()
   merchantId?: string;
}
