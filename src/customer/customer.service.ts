import { AppService } from '@common/decorator/app_service.decorator';
import { GetUserDto, LoginDto } from '@common/shared/user/user.dto';
import { ContextService } from '@common/core/context/context.service';
import { Inject } from '@nestjs/common';
import { MERCHANT, REPOSITORY } from '@common/constant';
import { Repository } from '@common/core/repository';
import { Customer } from '@common/schema/customer.schema';
import { CreateCustomerDto } from './customer.dto';
import { CustomerTierService } from '../customer_tier/customer_tier.service';
import { AppRedisService } from '@common/core/app_redis/app_redis.service';
import { APP_MERCHANT } from '@common/constant/db.constant';
import { getServiceToken } from '@common/utils/misc';
import { MerchantServiceMethods } from '@common/dto/merchant.dto';
import { UserService } from '@common/shared/user/user.service';

@AppService()
export class CustomerService extends UserService {
   constructor(
      protected readonly context: ContextService,
      protected readonly db: AppRedisService,
      @Inject(REPOSITORY) protected readonly repository: Repository<Customer>,
      private readonly tierService: CustomerTierService,
      @Inject(getServiceToken(MERCHANT)) private readonly merchantService: MerchantServiceMethods,
   ) {
      super();
   }

   async getUser(dto: GetUserDto) {
      return await this.repository.findOne({ filter: dto });
   }

   async createUser(dto: CreateCustomerDto) {
      const { data: tier } = await this.tierService.getTier({ isBaseTier: true });
      return await this.repository.create({
         ...dto,
         tier,
         merchant: (await this.db.get<AppMerchant>(APP_MERCHANT)).merchant,
      });
   }

   async loginUser(dto: LoginDto) {
      return await this.login(
         dto,
         async (id) => (await this.merchantService.merchantWithAuth({ id })).data,
      );
   }
}
