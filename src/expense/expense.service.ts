import AppService from '@common/decorator/app_service.decorator';
import Expense from './expense.schema';
import ACoreService from '@common/core/core.service';
import { Inject } from '@nestjs/common';
import { REPOSITORY } from '@common/constant';
import Repository from '@common/core/repository';
import { CreateExpenseDto } from './expense.dto';
import { ProductVariantService } from '../product_variant/product_variant.service';

@AppService()
export default class ExpenseService extends ACoreService<Expense> {
   constructor(
      @Inject(REPOSITORY) protected readonly repository: Repository<Expense>,
      private readonly productVariantService: ProductVariantService,
   ) {
      super();
   }

   async create({ products, ...dto }: CreateExpenseDto) {
      const variantIds: Array<any> = products.map((p) => p.id);
      const percents = products.map((p) => p.percent);
      await this.productVariantService.findByIds({ ids: variantIds });
      return this.repository.create({
         ...dto,
         effectiveProducts: variantIds,
         contributionPercent: percents,
      });
   }
}
