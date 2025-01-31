import { Inject } from '@nestjs/common';
import { MERCHANT } from '@common/constant';
import Partner from './partner.schema';
import { getServiceToken } from '@common/utils/regex';
import { MerchantServiceMethods } from '@common/dto/merchant.dto';
import AppService from '@common/decorator/app_service.decorator';
import { AUserService } from '@shared/user/user.service';
import AppRedisService from '@common/core/app_redis/app_redis.service';
import { GetUserDto } from '@shared/user/user.dto';
import AppBrokerService from '@common/core/app_broker/app_broker.service';
import AddressService from '@shared/address/address.service';
import { CreatePartnerDto } from './partner.dto';
import CategoryService from '@shared/category/category.service';
import { ModuleRef } from '@nestjs/core';

@AppService()
export default class PartnerService extends AUserService<Partner> {
   constructor(
      protected readonly moduleRef: ModuleRef,
      protected readonly db: AppRedisService,
      protected readonly appBroker: AppBrokerService,
      protected readonly addressService: AddressService,
      protected readonly categoryService: CategoryService,
      @Inject(getServiceToken(MERCHANT)) protected readonly merchantService: MerchantServiceMethods,
   ) {
      super();
   }

   async create({ ctx, isSupplier, ...dto }: CreatePartnerDto) {
      const repository = await this.getRepository(ctx.connection, ctx.session);

      return await repository.create({
         ...(await this.getCreateUserDto({ ctx, ...dto })),
         isSupplier,
      });
   }

   async getUser({ ctx: { connection, session }, ...dto }: GetUserDto) {
      const repository = await this.getRepository(connection, session);
      return await repository.findOne({ filter: dto });
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
