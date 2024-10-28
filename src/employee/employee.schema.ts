import { SchemaTypes } from 'mongoose';
import { Schema, SchemaFactory } from '@nestjs/mongoose';
import User from '@shared/user/user.schema';
import AppProp from '@common/decorator/app_prop.decorator';
import EmployeeRole from '../employee_role/employee_role.schema';
import { Amount, UserRole } from '@common/dto/entity.dto';
import {
   IsBoolean,
   IsMongoId,
   IsNumber,
   IsString,
   Max,
   Min,
   ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { IntersectionType, PartialType } from '@nestjs/swagger';

export class ProductionContribution {
   @IsNumber()
   @Min(0)
   @Max(100)
   involvement: number;

   @IsString()
   productId: string;
}

export class EmployeeConfig {
   @ValidateNested()
   @Type(() => UserRole)
   defaultRole?: UserRole;

   @ValidateNested({ each: true })
   @Type(() => ProductionContribution)
   productionContributions?: ProductionContribution[];

   @IsMongoId({ each: true })
   adjustments?: string[];

   @ValidateNested()
   @Type(() => Amount)
   basicSalary?: Amount;

   @IsBoolean()
   allowSellerApp: boolean;

   @IsBoolean()
   allowAdminApp: boolean;
}

@Schema()
export default class Employee extends IntersectionType(User, PartialType(EmployeeConfig)) {
   @AppProp({ type: SchemaTypes.ObjectId, ref: 'EmployeeRole' })
   role: EmployeeRole;
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);
