import AppService from '@common/decorator/app_service.decorator';
import BaseService from '@common/core/base/base.service';
import PromoCode from './promo_code.schema';
import { GetAdjustmentWithPromoCodeDto, GetPromoCodeDto } from './promo_code.dto';
import { getBaseAdjustmentQuery } from '../price_adjustment/price_adjustment.service';
import { ModuleRef } from '@nestjs/core';

@AppService()
export class PromoCodeService extends BaseService<PromoCode> {
   constructor(protected readonly moduleRef: ModuleRef) {
      super();
   }

   async getPromoCode(
      { connection, session }: RequestContext,
      { code, lean, populate }: GetPromoCodeDto,
   ) {
      const repository = await this.getRepository(connection, session);
      return await repository.findOne({
         filter: { code },
         errorOnNotFound: true,
         options: { lean, populate },
      });
   }

   async getAdjustmentWithPromoCode({
      ctx: { connection, session },
      promoCode,
      ...dto
   }: GetAdjustmentWithPromoCodeDto) {
      const repository = await this.getRepository(connection, session);
      return await repository.findOne({
         filter: { code: promoCode, ...getBaseAdjustmentQuery(dto, 'promotion') },
         errorOnNotFound: true,
         options: { populate: ['promotion'] },
      });
   }
}
