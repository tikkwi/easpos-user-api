import { CreateCustomerTierDto, GetTierDto } from './customer_tier.dto';
import AppService from '@common/decorator/app_service.decorator';
import BaseService from '@common/core/base/base.service';
import AppRedisService from '@common/core/app_redis/app_redis.service';
import CustomerTier from './customer_tier.schema';

@AppService()
export class CustomerTierService extends BaseService<CustomerTier> {
   constructor(private readonly db: AppRedisService) {
      super();
   }

   async getTier({ ctx: { connection }, id, isBaseTier }: GetTierDto) {
      const repository = await this.getRepository(connection);
      return await repository.findOne({
         filter: {
            id,
            isBaseTier,
            merchant: (await this.db.get('merchant')).merchant._id,
         },
      });
   }

   async createTier({ ctx: { connection }, ...dto }: CreateCustomerTierDto) {
      const repository = await this.getRepository(connection);
      return await repository.create(dto);
   }
}
