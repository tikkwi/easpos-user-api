import { Inject } from '@nestjs/common';
import { MERCHANT, REPOSITORY } from '@common/constant';
import Partner from './partner.schema';
import { getServiceToken } from '@common/utils/misc';
import { MerchantServiceMethods } from '@common/dto/merchant.dto';
import AppService from '@common/decorator/app_service.decorator';
import { AUserService } from '@shared/user/user.service';
import AppRedisService from '@common/core/app_redis/app_redis.service';
import Repository from '@common/core/repository';
import { GetUserDto } from '@shared/user/user.dto';
import AppBrokerService from '@common/core/app_broker/app_broker.service';
import AddressService from '@shared/address/address.service';
import { CreatePartnerDto } from './partner.dto';
import { EUser } from '@common/utils/enum';

@AppService()
export default class PartnerService extends AUserService<Partner> {
   constructor(
      protected readonly db: AppRedisService,
      protected readonly appBroker: AppBrokerService,
      protected readonly addressService: AddressService,
      @Inject(REPOSITORY) protected readonly repository: Repository<Partner>,
      @Inject(getServiceToken(MERCHANT)) protected readonly merchantService: MerchantServiceMethods,
   ) {
      super();
   }

   async create({ isSupplier, ...dto }: CreatePartnerDto) {
      return await this.repository.create({
         ...(await this.getCreateUserDto({ type: EUser.Partner, ...dto })),
         isSupplier,
      });
   }

   async getUser(dto: GetUserDto) {
      return await this.repository.findOne({ filter: dto });
   }

   // async createUser(dto: CreateUserDto) {
   //    return await this.repository.create({
   //       ...dto,
   //       merchant: (await this.db.get('merchant')).merchant,
   //    });
   // }

   // async loginUser(dto: LoginDto) {
   //    return await this.login(
   //       dto,
   //       async (id) => (await this.merchantService.merchantWithAuth({ id })).data,
   //    );
   // }
}
