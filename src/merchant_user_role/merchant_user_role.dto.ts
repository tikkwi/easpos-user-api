import { CoreDto } from '@common/dto/core.dto';
import { MerchantUserRole } from './merchant_user_role.schema';
import { IsBoolean, IsMongoId, IsOptional, ValidateIf } from 'class-validator';
import { PickType } from '@nestjs/swagger';

export class CreateMerchantRoleDto extends CoreDto<MerchantUserRole>(MerchantUserRole) {}

export class GetMerchantUserRoleDto {
   @IsOptional()
   @IsBoolean()
   isOwner?: boolean;

   @IsOptional()
   @IsMongoId()
   id?: string;

   @IsOptional()
   @IsMongoId()
   merchantId?: string;
}

export class CreateMerchantUserRoleDto extends PickType(MerchantUserRole, [
   'role',
   'isOwner',
   'basicSalary',
]) {
   @ValidateIf((o) => o.isOwner)
   @IsMongoId()
   merchantId?: string;
}
