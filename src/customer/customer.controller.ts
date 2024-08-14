import { AppController } from '@common/decorator/app_controller.decorator';
import { EAllowedUser } from '@common/utils/enum';
import { CustomerService } from './customer.service';

@AppController('customer', [EAllowedUser.Merchant])
export class CustomerController {
   constructor(private readonly service: CustomerService) {}
}
