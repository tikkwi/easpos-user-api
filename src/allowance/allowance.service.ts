import AppService from '@common/decorator/app_service.decorator';
import AllowanceService from '@shared/allowance/allowance.service';
import MerchantAllowance from './allowance.schema';
import Repository from '@common/core/repository';
import { Inject } from '@nestjs/common';
import { REPOSITORY } from '@common/constant';
import ProductService from '@shared/product/product.service';
import UnitService from '@shared/unit/unit.service';
import { GetPurchaseAllowanceDto } from './allowance.dto';

@AppService()
export default class MerchantAllowanceService extends AllowanceService<MerchantAllowance> {
   constructor(
      @Inject(REPOSITORY) protected readonly repository: Repository<MerchantAllowance>,
      protected readonly productService: ProductService,
      protected readonly unitService: UnitService,
   ) {
      super();
   }

   async getPurchasedAllowance({ customerId, ...dto }: GetPurchaseAllowanceDto) {
      const benefits = { pDiscount: 0, discount: 0, cash: 0, cPoint: 0, point: 0, products: [] };
      const { data: allowances } = await this.getApplicableAllowances(dto);
      for (const { benefit } of allowances) {
      }
   }
}
