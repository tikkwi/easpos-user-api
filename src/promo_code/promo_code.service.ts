import AppService from '@common/decorator/app_service.decorator';
import ACoreService from '@common/core/core.service';
import PromoCode from './promo_code.schema';
import { Inject } from '@nestjs/common';
import { REPOSITORY } from '@common/constant';
import Repository from '@common/core/repository';
import { GetAdjustmentWithPromoCodeDto, GetPromoCodeDto } from './promo_code.dto';
import { getBaseAdjustmentQuery } from '../price_adjustment/price_adjustment.service';

@AppService()
export class PromoCodeService extends ACoreService<PromoCode> {
   constructor(@Inject(REPOSITORY) protected readonly repository: Repository<PromoCode>) {
      super();
   }

   async getPromoCode({ code, lean, populate }: GetPromoCodeDto) {
      return await this.repository.findOne({
         filter: { code },
         errorOnNotFound: true,
         options: { lean, populate },
      });
   }

   async getAdjustmentWithPromoCode({ promoCode, ...dto }: GetAdjustmentWithPromoCodeDto) {
      return await this.repository.findOne({
         filter: { code: promoCode, ...getBaseAdjustmentQuery(dto, 'promotion') },
         errorOnNotFound: true,
         options: { populate: ['promotion'] },
      });
   }
}
