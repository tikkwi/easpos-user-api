import { EAllowedUser } from '@common/utils/enum';
import AppController from '@common/decorator/app_controller.decorator';
import CustomerService from './customer.service';
import UserController from '@shared/user/user.controller';

@AppController('customer', [EAllowedUser.Merchant])
export default class CustomerController extends UserController<CustomerService> {
   constructor(protected readonly service: CustomerService) {
      super();
   }
}
