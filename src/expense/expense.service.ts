import AppService from '@common/decorator/app_service.decorator';
import Expense from './expense.schema';
import BaseService from '@common/core/base/base.service';
import { CreateExpenseDto } from './expense.dto';
import { ProductVariantService } from '../product_variant/product_variant.service';

@AppService()
export default class ExpenseService extends BaseService<Expense> {
   constructor(private readonly productVariantService: ProductVariantService) {
      super();
   }

   async create({ products, ...dto }: CreateExpenseDto) {
      const repository = await this.getRepository();
      const variantIds: Array<any> = products.map((p) => p.id);
      const percents = products.map((p) => p.percent);
      await this.productVariantService.findByIds({ ids: variantIds });
      return repository.create({
         ...dto,
         effectiveProducts: variantIds,
         contributionPercent: percents,
      });
   }
}
