import { Inject, Injectable } from '@nestjs/common';
import { getServiceToken } from '@common/utils/regex';
import { MERCHANT } from '@common/constant';
import AppBrokerService from '@common/core/app_broker/app_broker.service';
import { MerchantServiceMethods } from '@common/dto/merchant.dto';

@Injectable()
export class UserAppService {
   constructor(
      private readonly appBroker: AppBrokerService,
      @Inject(getServiceToken(MERCHANT)) private readonly merchantService: MerchantServiceMethods,
   ) {}

   async test(req?: Request) {
      console.log(req);
      return 'mingalarbr..';
   }

   async msTest() {
      return await this.appBroker.request({
         action: (meta) => this.merchantService.tmpTst(meta),
         cache: false,
      });
      // return 'mingalarbr..';
   }
}
