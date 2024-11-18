import AppService from '@common/decorator/app_service.decorator';
import ACoreService from '@common/core/core.service';
import StockUnit from './stock_unit.schema';
import { Inject } from '@nestjs/common';
import { REPOSITORY } from '@common/constant';
import Repository from '@common/core/repository';
import { GetStockLeftDto } from './stock_unit.dto';
import UnitService from '@shared/unit/unit.service';

@AppService()
export default class StockUnitService extends ACoreService<StockUnit> {
   constructor(
      @Inject(REPOSITORY) protected readonly repository: Repository<StockUnit>,
      private readonly unitService: UnitService,
   ) {
      super();
   }

   async getStockLeft({ id, targetId }: GetStockLeftDto) {
      const { data: stocks } = await this.repository.find({
         filter: {
            product: id,
            'unitQuantity.amount': { $gt: 0 },
         },
         projection: { unitQuantity: 1 },
      });

      return await this.unitService.exchangeUnit({
         current: stocks.map(({ unitQuantity }) => unitQuantity),
         targetId,
      });
   }
}
