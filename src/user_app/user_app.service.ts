import { MERCHANT, USER } from '@common/constant';
import { AppBrokerService } from '@common/core/app_broker/app_broker.service';
import { CreateMerchantDto, MerchantServiceMethods } from '@common/dto/merchant.dto';
import { CreateUserDto, UserServiceMethods } from '@common/dto/user.dto';
import { EApp } from '@common/utils/enum';
import { getServiceToken } from '@common/utils/misc';
import { Inject, Injectable } from '@nestjs/common';
import { LoginDto } from './user_app.dto';

@Injectable()
export class UserAppService {
   constructor(
      @Inject(getServiceToken(MERCHANT))
      private readonly merchantService: MerchantServiceMethods,
      @Inject(getServiceToken(USER)) private readonly userService: UserServiceMethods,
      private readonly appBroker: AppBrokerService,
   ) {}

   async test() {
      return await this.appBroker.request(
         (meta) => this.merchantService.tmpTst(meta),
         true,
         EApp.Admin,
      );
   }

   async createUser(dto: CreateUserDto) {
      return await this.userService.createUser(dto);
   }

   async createMerchant(dto: CreateMerchantDto) {
      return await this.merchantService.createMerchant(dto);
   }

   async login(dto: LoginDto) {}
}
