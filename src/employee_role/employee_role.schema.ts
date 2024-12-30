import { Schema, SchemaFactory } from '@nestjs/mongoose';
import AppProp from '@common/decorator/app_prop.decorator';
import BaseSchema from '@common/core/base/base.schema';
import { IntersectionType, PickType } from '@nestjs/swagger';
import { SelectionTypeIf } from '@common/dto/core.dto';
import { EmployeeConfig } from '../employee/employee.schema';

//NOTE:  all config here can be overwritten at specific employee level
@Schema()
export default class EmployeeRole extends IntersectionType(
   BaseSchema,
   SelectionTypeIf(
      ({ isOwner }) => isOwner,
      EmployeeConfig,
      ['allowSellerApp', 'allowAdminApp'],
      false,
   ),
   PickType(EmployeeConfig, ['allowSellerApp', 'allowAdminApp']),
) {
   @AppProp({ type: Boolean, default: false, required: false })
   isOwner: boolean;
}

export const EmployeeRoleSchema = SchemaFactory.createForClass(EmployeeRole);
