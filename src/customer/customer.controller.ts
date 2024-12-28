import { EAllowedUser } from '@common/utils/enum';
import AppController from '@common/decorator/app_controller.decorator';
import CustomerService from './customer.service';
import AUserController from '@shared/user/user.controller';

@AppController('customer', [EAllowedUser.Employee])
export default class CustomerController extends AUserController<CustomerService> {
   constructor(protected readonly service: CustomerService) {
      super();
   }
}
