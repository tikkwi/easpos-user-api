import AppService from '@common/decorator/app_service.decorator';
import PromoCode from './promo_code.schema';
import { ModuleRef } from '@nestjs/core';
import APromoCodeService from '@shared/promo_code/promo_code.service';

@AppService()
export class PromoCodeService extends APromoCodeService<PromoCode> {
   constructor(protected readonly moduleRef: ModuleRef) {
      super();
   }
}
