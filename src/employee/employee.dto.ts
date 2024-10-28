import { IsMongoId, ValidateIf, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateEmployeeRoleDto } from '../employee_role/employee_role.dto';
import { CreateUserDto } from '@shared/user/user.dto';

class EmployeeRoleDto {
   @ValidateIf((o) => !o.role)
   @IsMongoId()
   roleId?: string;

   @ValidateIf((o) => !o.roleId)
   @ValidateNested()
   @Type(() => CreateEmployeeRoleDto)
   role?: CreateEmployeeRoleDto;
}

export class CreateEmployeeDto extends CreateUserDto {
   @ValidateIf((o) => !o.merchantId)
   @ValidateNested()
   @Type(() => EmployeeRoleDto)
   roleDto?: EmployeeRoleDto;

   @ValidateIf((o) => !o.role)
   @IsMongoId()
   merchantId?: string;
}
