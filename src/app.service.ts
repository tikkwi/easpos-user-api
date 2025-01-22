import { Inject } from '@nestjs/common';
import { getServiceToken } from '@common/utils/regex';
import { MERCHANT } from '@common/constant';
import AppBrokerService from '@common/core/app_broker/app_broker.service';
import { CreateMerchantDto, MerchantServiceMethods } from '@common/dto/merchant.dto';
import BaseService from '@common/core/base/base.service';
import { ModuleRef } from '@nestjs/core';
import EmployeeService from './employee/employee.service';
import { connection, Types } from 'mongoose';
import AppContext from '@common/core/app_context.service';
import $AppService from '@common/decorator/app_service.decorator';
import { connectMerchantDb } from '@common/utils/misc';

@$AppService()
export default class AppService extends BaseService {
   constructor(
      protected readonly moduleRef: ModuleRef,
      private readonly appBroker: AppBrokerService,
      @Inject(getServiceToken(MERCHANT)) private readonly merchantService: MerchantServiceMethods,
      private readonly employeeService: EmployeeService,
   ) {
      super();
   }

   async msTest(dto: { message: string }) {
      return await this.appBroker.request({
         action: (meta) => this.merchantService.tmpTst(dto, meta),
      });
   }

   async createMerchant({ ctx, ...dto }: CreateMerchantDto) {
      const merchantId = new Types.ObjectId().toString();
      await connectMerchantDb(ctx, merchantId, true);
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
      const merchant = await this.appBroker.request<Merchant>({
         action: (meta) => this.merchantService.createMerchant({ _id: merchantId, ...dto }, meta),
      });
      return { data: { merchant, owner: employee } };
   }
}
