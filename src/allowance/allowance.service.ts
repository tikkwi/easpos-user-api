import AppService from '@common/decorator/app_service.decorator';
import AllowanceService from '@shared/allowance/allowance.service';
import MerchantAllowance from './allowance.schema';
import Repository from '@common/core/repository';
import { Inject } from '@nestjs/common';
import { REPOSITORY } from '@common/constant';
import ProductService from '@shared/product/product.service';
import UnitService from '@shared/unit/unit.service';
import { GetPurchaseAllowanceDto } from './allowance.dto';
import AllowanceCodeService from '@shared/allowance_code/allowance_code.service';
import AppRedisService from '@common/core/app_redis/app_redis.service';

@AppService()
export default class MerchantAllowanceService extends AllowanceService<MerchantAllowance> {
   constructor(
      @Inject(REPOSITORY) protected readonly repository: Repository<MerchantAllowance>,
      protected readonly productService: ProductService,
      protected readonly unitService: UnitService,
      protected readonly allowanceCodeService: AllowanceCodeService,
      protected readonly db: AppRedisService,
   ) {
      super();
   }

   async getPurchasedAllowance({ customerId, ...dto }: GetPurchaseAllowanceDto) {
      const benefits = { pDiscount: 0, discount: 0, cash: 0, cPoint: 0, point: 0, products: [] };
      const allowances = await this.db.get(
         'applicable_alw',
         () => this.getApplicableAllowances(dto) as any,
      );
      for (const { benefit } of allowances) {
      }
   }
}
