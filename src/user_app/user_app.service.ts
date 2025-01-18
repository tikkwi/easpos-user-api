import { Inject, Injectable } from '@nestjs/common';
import { getServiceToken } from '@common/utils/regex';
import { MERCHANT } from '@common/constant';
import AppBrokerService from '@common/core/app_broker/app_broker.service';
import { CreateMerchantDto, MerchantServiceMethods } from '@common/dto/merchant.dto';
import BaseService from '@common/core/base/base.service';
import { ModuleRef } from '@nestjs/core';
import EmployeeService from '../employee/employee.service';
import AppContext from '@common/core/app_context.service';

@Injectable()
export class UserAppService extends BaseService {
   constructor(
      protected readonly moduleRef: ModuleRef,
      private readonly appBroker: AppBrokerService,
      @Inject(getServiceToken(MERCHANT)) private readonly merchantService: MerchantServiceMethods,
      private readonly employeeService: EmployeeService,
   ) {
      super();
   }

   async test(req?: Request) {
      return 'mingalarbr..';
   }

   async msTest(dto: { message: string }) {
      return await this.appBroker.request({
         action: (meta) => this.merchantService.tmpTst(dto, meta),
      });
   }

   async createMerchant({ ctx, ...dto }: CreateMerchantDto) {
      // const merchantId = new Types.ObjectId().toString();
      const merchantId = '678ba3d859471cff15d4a3e7';
      const [connection, session] = await AppContext.getSession(merchantId, true);
      ctx.connection = connection;
      ctx.session = session;
      ctx.merchantId = merchantId;
      ctx.rollback = async () => {
         await connection.db.dropDatabase();
         AppContext.delete(merchantId);
      };
      const { data: employee } = await this.employeeService.createEmployee({
         ctx,
         isOwner: true,
         mail: dto.mail,
         password: '1111234',
         mobileNo: dto.mobileNo,
      });
      return { data: employee };
      // const merchant = await this.appBroker.request<Merchant>({
      //    action: (meta) => this.merchantService.createMerchant({ _id: merchantId, ...dto }, meta),
      // });
      // return { data: { merchant, owner: employee } };
   }
}
