import { Inject } from '@nestjs/common';
import { MERCHANT, REPOSITORY } from '@common/constant';
import { AddCustomerAllowanceDto, CreateCustomerDto } from './customer.dto';
import { CustomerTierService } from '../customer_tier/customer_tier.service';
import { getServiceToken } from '@common/utils/misc';
import { MerchantServiceMethods } from '@common/dto/merchant.dto';
import AppService from '@common/decorator/app_service.decorator';
import { UserService } from '@shared/user/user.service';
import AppRedisService from '@common/core/app_redis/app_redis.service';
import Repository from '@common/core/repository';
import Customer from './customer.schema';
import AppBrokerService from '@common/core/app_broker/app_broker.service';
import MerchantAllowanceService from '../allowance/allowance.service';
import { EMerchantAllowanceBenefit } from '@common/utils/enum';
import { $dayjs } from '@common/utils/datetime';

@AppService()
export default class CustomerService extends UserService<Customer> {
   constructor(
      protected readonly appBroker: AppBrokerService,
      @Inject(REPOSITORY) protected readonly repository: Repository<Customer>,
      @Inject(getServiceToken(MERCHANT)) protected readonly merchantService: MerchantServiceMethods,
      protected readonly db: AppRedisService,
      private readonly tierService: CustomerTierService,
      private readonly allowanceService: MerchantAllowanceService,
   ) {
      super();
   }

   async createUser(dto: CreateCustomerDto) {
      const { data: tier } = await this.tierService.getTier({ isBaseTier: true });
      return await this.repository.create({
         ...dto,
         tier,
         merchant: (await this.db.get('merchant')).merchant,
      });
   }

   async addCustomerAllowance({ context, customerId, allowanceIds }: AddCustomerAllowanceDto) {
      const { data: customer } = await this.repository.findOne({
         id: customerId,
         errorOnNotFound: true,
         options: { lean: false },
      });
      const updateCredit = (exp: string | Date, ext: boolean, amount: number, point?: boolean) => {
         if (exp) {
            if (ext || !context.get('merchantConfig')[`extCus${point ? 'Point' : 'Cash'}`])
               customer.timedPoint[new Date(exp).getTime()] = amount;
            else {
               const extCredit = `extensible${point ? 'Point' : 'Cash'}`;
               const hTime =
                  customer[extCredit] && $dayjs(customer[extCredit].expireAt).isAfter($dayjs(exp))
                     ? customer[extCredit].expireAt
                     : exp;
               customer.extensibleCash = {
                  expireAt: new Date(hTime).toISOString(),
                  amount: (customer[extCredit]?.amount ?? 0) + amount,
               };
            }
         } else customer[point ? 'point' : 'cash'] += amount;
      };

      for (const id of allowanceIds) {
         const allowance = await this.allowanceService.monitorExpire({ id }, true);
         if (
            [EMerchantAllowanceBenefit.Point, EMerchantAllowanceBenefit.Cash].includes(
               allowance.benefit.type,
            )
         )
            updateCredit(
               allowance.expireAt,
               allowance.benefit.bypassExtendability,
               allowance.benefit.amount,
               allowance.benefit.type === EMerchantAllowanceBenefit.Point,
            );
         else customer.allowances.push(allowance);
      }
      return { data: await customer.save({ session: context.get('session') }) };
   }
}
