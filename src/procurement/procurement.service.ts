import AppService from '@common/decorator/app_service.decorator';
import ACoreService from '@common/core/core.service';
import Procurement from './procurement.schema';
import { Inject } from '@nestjs/common';
import Repository from '@common/core/repository';
import { REPOSITORY } from '@common/constant';
import { CreateProcurementDto } from './procurement.dto';
import PartnerService from '../partner/partner.service';
import ExpenseService from '../expense/expense.service';
import FieldService from '../field/field.service';
import { ProductVariantService } from '../product_variant/product_variant.service';

@AppService()
export default class ProcurementService extends ACoreService<Procurement> {
   constructor(
      @Inject(REPOSITORY) protected readonly repository: Repository<Procurement>,
      private readonly partnerService: PartnerService,
      private readonly expenseService: ExpenseService,
      private readonly fieldService: FieldService,
      private readonly variantService: ProductVariantService,
   ) {
      super();
   }

   async create({ supplierId, expenseIds, batches, ...dto }: CreateProcurementDto) {
      const { data: supplier } = await this.partnerService.findById({ id: supplierId });
      const { data: expenses } = await this.expenseService.findByIds({ ids: expenseIds });
      for (const batch of batches) {
         for (const { id, value } of batch.stock.metaValue) {
            await this.fieldService.validateField({ id, value });
         }
         if (!batch.stock.stockVariantId)
            await this.variantService.findById({ id: batch.stock.stockVariantId });
      }
      return await this.repository.create({ supplier, expenses, batches, ...dto });
   }
}
