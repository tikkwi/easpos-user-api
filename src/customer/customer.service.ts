import { AppService } from '@common/decorator/app_service.decorator';
import { CoreService } from '@common/core/service/core.service';
import { CustomerServiceMethods, GetUserDto } from '@common/dto/user.dto';
import { ContextService } from '@common/core/context/context.service';
import { Inject } from '@nestjs/common';
import { REPOSITORY } from '@common/constant';
import { Repository } from '@common/core/repository';
import { Customer } from '@common/schema/customer.schema';
import { CreateCustomerDto } from './customer.dto';
import { CustomerTierService } from '../customer_tier/customer_tier.service';
import { AppRedisService } from '@common/core/app_redis/app_redis.service';
import { APP_MERCHANT } from '@common/constant/db.constant';

@AppService()
export class CustomerService extends CoreService implements CustomerServiceMethods {
   constructor(
      protected readonly context: ContextService,
      private readonly tierService: CustomerTierService,
      private readonly db: AppRedisService,
      @Inject(REPOSITORY) private readonly repository: Repository<Customer>,
   ) {
      super();
   }

   async getUser(dto: GetUserDto) {
      return await this.repository.findOne({ filter: dto });
   }

   async createCustomer(dto: CreateCustomerDto) {
      const { data: tier } = await this.tierService.getTier({ isBaseTier: true });
      return await this.repository.create({
         ...dto,
         tier,
         merchant: await this.db.get(APP_MERCHANT),
      });
   }
}
