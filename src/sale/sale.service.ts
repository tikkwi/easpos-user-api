import AppService from '@common/decorator/app_service.decorator';
import BaseService from '@common/core/base/base.service';
import { Sale } from './sale.schema';
import { ModuleRef } from '@nestjs/core';
import { EUser } from '@common/utils/enum/misc.enum';
import { GetCustomerPurchaseDto } from './sale.dto';
import { $dayjs } from '@common/utils/datetime';

@AppService()
export default class SaleService extends BaseService<Sale> {
   constructor(protected readonly moduleRef: ModuleRef) {
      super();
   }

   async getCustomerPurchases({
      ctx: { connection, session, user: authUser },
      id,
      duration: { amount, type },
   }: GetCustomerPurchaseDto) {
      const repository = await this.getRepository(connection, session);
      const isCustomerLoggedIn = authUser.type === EUser.Customer;
      if (!isCustomerLoggedIn && !id) return { data: undefined, message: 'Customer not logged in' };
      return await repository.find({
         filter: {
            customer: id ?? authUser.id,
            createdAt: amount
               ? {
                    $gte: $dayjs()
                       .add(-amount, type.toLowerCase() as any)
                       .toDate(),
                 }
               : undefined,
         },
      });
   }
}
