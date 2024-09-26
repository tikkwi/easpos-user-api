import { Inject } from '@nestjs/common';
import { MERCHANT, REPOSITORY } from '@common/constant';
import { CreateCustomerDto } from './customer.dto';
import { CustomerTierService } from '../customer_tier/customer_tier.service';
import { getServiceToken } from '@common/utils/misc';
import { MerchantServiceMethods } from '@common/dto/merchant.dto';
import AppService from '@common/decorator/app_service.decorator';
import { UserService } from '@shared/user/user.service';
import AppRedisService from '@common/core/app_redis/app_redis.service';
import Repository from '@common/core/repository';
import Customer from './customer.schema';
import ContextService from '@common/core/context';
import AppBrokerService from '@common/core/app_broker/app_broker.service';

@AppService()
export default class CustomerService extends UserService<Customer> {
   constructor(
      @Inject(REPOSITORY) protected readonly repository: Repository<Customer>,
      @Inject(getServiceToken(MERCHANT)) protected readonly merchantService: MerchantServiceMethods,
      protected readonly appBroker: AppBrokerService,
      protected readonly db: AppRedisService,
      private readonly tierService: CustomerTierService,
   ) {
      super();
   }

   async createUser(dto: CreateCustomerDto) {
      const { data: tier } = await this.tierService.getTier({ isBaseTier: true });
      return await this.repository.create({
         ...dto,
         tier,
         merchant: ContextService.get('merchant').merchant,
      });
   }
}
