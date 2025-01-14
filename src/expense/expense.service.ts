import AppService from '@common/decorator/app_service.decorator';
import Expense from './expense.schema';
import BaseService from '@common/core/base/base.service';
import { CreateExpenseDto } from './expense.dto';
import { ProductVariantService } from '../product_variant/product_variant.service';
import { ModuleRef } from '@nestjs/core';

@AppService()
export default class ExpenseService extends BaseService<Expense> {
   constructor(
      protected readonly moduleRef: ModuleRef,
      private readonly productVariantService: ProductVariantService,
   ) {
      super();
   }

   async create({ ctx, products, ...dto }: CreateExpenseDto) {
      const repository = await this.getRepository(ctx.connection, ctx.session);
      const variantIds: Array<any> = products.map((p) => p.id);
      const percents = products.map((p) => p.percent);
      await this.productVariantService.findByIds({ ctx, ids: variantIds });
      return repository.create({
         ...dto,
         effectiveProducts: variantIds,
         contributionPercent: percents,
      });
   }
}
