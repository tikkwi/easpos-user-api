import AppService from '@common/decorator/app_service.decorator';
import AllowanceService from '@shared/allowance/allowance.service';
import MerchantAllowance from './allowance.schema';
import Repository from '@common/core/repository';
import { BadRequestException, Inject } from '@nestjs/common';
import { REPOSITORY } from '@common/constant';
import ProductService from '@shared/product/product.service';
import UnitService from '@shared/unit/unit.service';
import { GetPurchaseAllowanceDto } from './allowance.dto';
import AllowanceCodeService from '@shared/allowance_code/allowance_code.service';
import AppRedisService from '@common/core/app_redis/app_redis.service';
import CustomerService from '../customer/customer.service';

@AppService()
export default class MerchantAllowanceService extends AllowanceService<MerchantAllowance> {
   constructor(
      @Inject(REPOSITORY) protected readonly repository: Repository<MerchantAllowance>,
      protected readonly productService: ProductService,
      protected readonly unitService: UnitService,
      protected readonly allowanceCodeService: AllowanceCodeService,
      protected readonly db: AppRedisService,
      private readonly customerService: CustomerService,
   ) {
      super();
   }

   async getPurchasedAllowance({ customerId, usages, context }: GetPurchaseAllowanceDto) {
      const benefits = { point: 0, discount: 0, cash: 0, product: [] };
      const allowances = await this.db.get('t_applicable_alw');
      if (!allowances) throw new BadRequestException('Refresh application allowances');
      for (const alw of allowances) {
         let usgInd;
         for (let i = 0; i < usages.length; i++) {
            if (usages[i].allowanceId === alw.id) {
               usgInd = i;
               break;
            }
         }
         if (usgInd !== undefined) {
            const { data: customer } = customerId
               ? await this.customerService.findById({ id: customerId, errorOnNotFound: true })
               : undefined;
            if (usages[usgInd].keep && alw.canKeep && customer)
               await this.customerService.addCustomerAllowance({
                  context,
                  customerId,
                  allowanceId: alw.id,
               });
            else {
            }
            usages.splice(usgInd, 1);
         }
      }

      // const benefits = { pDiscount: 0, discount: 0, cash: 0, cPoint: 0, point: 0, products: [] };
      // const allowances = await this.db.get(
      //    'applicable_alw',
      //    () => this.getApplicableAllowances(dto) as any,
      // );
      // for (const { benefit } of allowances) {
      // }
   }
}
