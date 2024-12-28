import { Inject, Injectable } from '@nestjs/common';
import { getServiceToken } from '@common/utils/misc';
import { MERCHANT } from '@common/constant';
import AppBrokerService from '@common/core/app_broker/app_broker.service';
import { MerchantServiceMethods } from '@common/dto/merchant.dto';

@Injectable()
export class UserAppService {
   constructor(
      private readonly appBroker: AppBrokerService,
      @Inject(getServiceToken(MERCHANT)) private readonly merchantService: MerchantServiceMethods,
   ) {}

   async test() {
      return await this.appBroker.request({
         action: (meta) => this.merchantService.tmpTst(meta),
         cache: false,
      });
      // return 'mingalarbr..';
   }
}
