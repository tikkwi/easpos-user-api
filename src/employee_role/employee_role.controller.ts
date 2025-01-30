import { EAllowedUser } from '@common/utils/enum/misc.enum';
import AppController from '@common/decorator/app_controller.decorator';
import { EmployeeRoleService } from './employee_role.service';

@AppController('merchant-user-role', [EAllowedUser.Employee])
export class EmployeeRoleController {
   constructor(private readonly service: EmployeeRoleService) {}
}
