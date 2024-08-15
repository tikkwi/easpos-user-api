import { AppService } from '@common/decorator/app_service.decorator';
import { CoreService } from '@common/core/service/core.service';
import { ContextService } from '@common/core/context/context.service';
import { Inject } from '@nestjs/common';
import { REPOSITORY } from '@common/constant';
import { Repository } from '@common/core/repository';
import { CustomerTier } from './customer_tier.schema';
import { CreateCustomerTierDto, GetTierDto } from './customer_tier.dto';
import { AppRedisService } from '@common/core/app_redis/app_redis.service';
import { APP_MERCHANT } from '@common/constant/db.constant';

@AppService()
export class CustomerTierService extends CoreService {
   constructor(
      protected readonly context: ContextService,
      private readonly db: AppRedisService,
      @Inject(REPOSITORY) private readonly repository: Repository<CustomerTier>,
   ) {
      super();
   }

   async getTier({ id, isBaseTier }: GetTierDto) {
      return await this.repository.findOne({
         filter: { id, isBaseTier, merchant: this.db.get(APP_MERCHANT) },
      });
   }

   async createTier(dto: CreateCustomerTierDto) {
      return await this.repository.create({ ...dto, merchant: await this.db.get(APP_MERCHANT) });
   }
}
