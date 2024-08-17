import { AppController } from '@common/decorator/app_controller.decorator';
import { CustomerTierService } from './customer_tier.service';

@AppController('customer-tier')
export class CustomerTierController {
   constructor(private readonly service: CustomerTierService) {}
}
