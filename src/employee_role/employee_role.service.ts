import AppService from '@common/decorator/app_service.decorator';
import BaseService from '@common/core/base/base.service';
import EmployeeRole from './employee_role.schema';

@AppService()
export class EmployeeRoleService extends BaseService<EmployeeRole> {}
