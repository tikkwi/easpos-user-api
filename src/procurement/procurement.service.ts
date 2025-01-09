import AppService from '@common/decorator/app_service.decorator';
import BaseService from '@common/core/base/base.service';
import Procurement from './procurement.schema';
import { CreateProcurementDto } from './procurement.dto';
import PartnerService from '../partner/partner.service';
import ExpenseService from '../expense/expense.service';
import FieldService from '../field/field.service';
import { ProductVariantService } from '../product_variant/product_variant.service';

@AppService()
export default class ProcurementService extends BaseService<Procurement> {
   constructor(
      private readonly partnerService: PartnerService,
      private readonly expenseService: ExpenseService,
      private readonly fieldService: FieldService,
      private readonly variantService: ProductVariantService,
   ) {
      super();
   }

   async create(
      ctx: RequestContext,
      { supplierId, expenseIds, batches, ...dto }: CreateProcurementDto,
   ) {
      const repository = await this.getRepository(ctx.connection, ctx.session);

      const { data: supplier } = await this.partnerService.findById(ctx, { id: supplierId });
      const { data: expenses } = await this.expenseService.findByIds(ctx, { ids: expenseIds });
      for (const batch of batches) {
         for (const { id, value } of batch.stock.metaValue) {
            await this.fieldService.validateField(ctx, { id, value });
         }
         if (!batch.stock.stockVariantId)
            await this.variantService.findById(ctx, { id: batch.stock.stockVariantId });
      }
      return await repository.create({ supplier, expenses, batches, ...dto });
   }
}
