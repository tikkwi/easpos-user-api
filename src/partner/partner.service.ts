import { AppService } from '@common/decorator/app_service.decorator';
import { CoreService } from '@common/core/service/core.service';
import { CreateUserDto, GetUserDto, PartnerServiceMethods } from '@common/dto/user.dto';
import { ContextService } from '@common/core/context/context.service';
import { Inject } from '@nestjs/common';
import { REPOSITORY } from '@common/constant';
import { Repository } from '@common/core/repository';
import { Partner } from '@common/schema/partner.schema';
import { AppRedisService } from '@common/core/app_redis/app_redis.service';
import { APP_MERCHANT } from '@common/constant/db.constant';

@AppService()
export class PartnerService extends CoreService implements PartnerServiceMethods {
   constructor(
      protected readonly context: ContextService,
      private readonly db: AppRedisService,
      @Inject(REPOSITORY) private readonly repository: Repository<Partner>,
   ) {
      super();
   }

   async getUser(dto: GetUserDto) {
      return await this.repository.findOne({ filter: dto });
   }

   async createPartner(dto: CreateUserDto) {
      return await this.repository.create({ ...dto, merchant: await this.db.get(APP_MERCHANT) });
   }
}
