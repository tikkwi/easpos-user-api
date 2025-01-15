import { Inject, Injectable } from '@nestjs/common';
import { getServiceToken } from '@common/utils/regex';
import { MERCHANT } from '@common/constant';
import AppBrokerService from '@common/core/app_broker/app_broker.service';
import { CreateMerchantDto, MerchantServiceMethods } from '@common/dto/merchant.dto';

@Injectable()
export class UserAppService {
   constructor(
      private readonly appBroker: AppBrokerService,
      @Inject(getServiceToken(MERCHANT)) private readonly merchantService: MerchantServiceMethods,
   ) {}

   async test(req?: Request) {
      return 'mingalarbr..';
   }

   async msTest(dto: { message: string }) {
      return await this.appBroker.request({
         action: (meta) => this.merchantService.tmpTst(dto, meta),
      });
   }

   async createMerchant(dto: CreateMerchantDto) {
      const merchant = await this.appBroker.request<Merchant>({
         action: async (meta) => await this.merchantService.nhtp_createMerchant(dto, meta),
      });
      console.log('gta', merchant);
      return merchant;
   }
}
