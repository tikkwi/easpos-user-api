import { EAllowedUser } from '@common/utils/enum';
import EmployeeService from './employee.service';
import AppController from '@common/decorator/app_controller.decorator';

@AppController('merchant-user', [EAllowedUser.Employee])
export class EmployeeController {
   constructor(private readonly service: EmployeeService) {}
}
