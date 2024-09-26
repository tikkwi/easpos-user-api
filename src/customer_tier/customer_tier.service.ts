import { Inject } from '@nestjs/common';
import { REPOSITORY } from '@common/constant';
import { CreateCustomerTierDto, GetTierDto } from './customer_tier.dto';
import AppService from '@common/decorator/app_service.decorator';
import CoreService from '@common/core/core.service';
import AppRedisService from '@common/core/app_redis/app_redis.service';
import Repository from '@common/core/repository';
import CustomerTier from './customer_tier.schema';

@AppService()
export class CustomerTierService extends CoreService {
   constructor(
      @Inject(REPOSITORY) protected readonly repository: Repository<CustomerTier>,
      private readonly db: AppRedisService,
   ) {
      super();
   }

   async getTier({ id, isBaseTier }: GetTierDto) {
      return await this.repository.findOne({
         filter: {
            id,
            isBaseTier,
            merchant: (await this.db.get('merchant')).merchant._id,
         },
      });
   }

   async createTier(dto: CreateCustomerTierDto) {
      return await this.repository.create({
         ...dto,
         merchant: (await this.db.get('merchant')).merchant,
      });
   }
}
