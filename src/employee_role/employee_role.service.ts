import AppService from '@common/decorator/app_service.decorator';
import BaseService from '@common/core/base/base.service';
import EmployeeRole from './employee_role.schema';
import { ModuleRef } from '@nestjs/core';

@AppService()
export class EmployeeRoleService extends BaseService<EmployeeRole> {
   constructor(protected readonly moduleRef: ModuleRef) {
      super();
   }
}
