import { Inject } from '@nestjs/common';
import { MERCHANT, REPOSITORY } from '@common/constant';
import Partner from './partner.schema';
import { getServiceToken } from '@common/utils/misc';
import { MerchantServiceMethods } from '@common/dto/merchant.dto';
import AppService from '@common/decorator/app_service.decorator';
import { UserService } from '@shared/user/user.service';
import ContextService from '@common/core/context/context.service';
import AppRedisService from '@common/core/app_redis/app_redis.service';
import Repository from '@common/core/repository';
import { CreateUserDto, GetUserDto } from '@shared/user/user.dto';
import AppBrokerService from '@common/core/app_broker/app_broker.service';

@AppService()
export default class PartnerService extends UserService {
   constructor(
      protected readonly context: ContextService,
      protected readonly db: AppRedisService,
      protected readonly appBroker: AppBrokerService,
      @Inject(REPOSITORY) protected readonly repository: Repository<Partner>,
      @Inject(getServiceToken(MERCHANT)) protected readonly merchantService: MerchantServiceMethods,
   ) {
      super();
   }

   async getUser(dto: GetUserDto) {
      return await this.repository.findOne({ filter: dto });
   }

   async createUser(dto: CreateUserDto) {
      return await this.repository.create({
         ...dto,
         merchant: (await this.db.get('merchant')).merchant,
      });
   }

   // async loginUser(dto: LoginDto) {
   //    return await this.login(
   //       dto,
   //       async (id) => (await this.merchantService.merchantWithAuth({ id })).data,
   //    );
   // }
}
