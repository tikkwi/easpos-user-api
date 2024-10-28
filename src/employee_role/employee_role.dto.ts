import { IsBoolean, IsMongoId, IsOptional, ValidateIf } from 'class-validator';
import { PickType } from '@nestjs/swagger';
import EmployeeRole from './employee_role.schema';

export class GetEmployeeRoleDto {
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

export class CreateEmployeeRoleDto extends PickType(EmployeeRole, [
   'role',
   'isOwner',
   'basicSalary',
]) {
   @ValidateIf((o) => o.isOwner)
   @IsMongoId()
   merchantId?: string;
}
