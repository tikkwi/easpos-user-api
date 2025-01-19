import { SchemaTypes } from 'mongoose';
import { Schema, SchemaFactory } from '@nestjs/mongoose';
import User from '@shared/user/user.schema';
import AppProp from '@common/decorator/app_prop.decorator';
import EmployeeRole from '../employee_role/employee_role.schema';
import { Amount } from '@common/dto/entity.dto';
import {
   IsBoolean,
   IsMongoId,
   IsNumber,
   IsString,
   Max,
   Min,
   ValidateIf,
   ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import PermissionTag from '@shared/permission_tag/permission_tag.schema';

export class ProductionContribution {
   @IsNumber()
   @Min(0)
   @Max(100)
   involvement: number;

   @IsString()
   productId: string;
}

export class EmployeeConfig {
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
export default class Employee extends User {
   @ValidateIf((o) => !o.isOwner)
   @AppProp({ type: SchemaTypes.ObjectId, ref: 'EmployeeRole', required: false })
   role?: EmployeeRole;

   @AppProp({ type: SchemaTypes.Mixed, required: false }, { type: EmployeeConfig })
   config?: EmployeeConfig;

   @AppProp({ type: Boolean, default: false })
   isOwner?: boolean;

   @AppProp({ type: [{ type: SchemaTypes.ObjectId, ref: 'PermissionTag' }], required: false })
   permissions?: Array<AppSchema<PermissionTag>>;
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);
