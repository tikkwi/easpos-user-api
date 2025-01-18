import { IsBoolean, IsMongoId, IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { EmployeeConfig } from '../employee/employee.schema';
import { CategoryDto } from '@shared/category/category.dto';

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

export class CreateEmployeeRoleDto {
   @ValidateNested()
   @Type(() => EmployeeConfig)
   config: EmployeeConfig;

   @IsNotEmpty()
   @ValidateNested()
   @Type(() => CategoryDto)
   category: CategoryDto;
}
