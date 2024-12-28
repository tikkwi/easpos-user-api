import { CustomerTierService } from './customer_tier.service';
import AppController from '@common/decorator/app_controller.decorator';

@AppController('customer-tier')
export class CustomerTierController {
   constructor(private readonly service: CustomerTierService) {}
}
