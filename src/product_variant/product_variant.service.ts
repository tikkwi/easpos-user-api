import AppService from '@common/decorator/app_service.decorator';
import ACoreService from '@common/core/core.service';
import { ProductVariant } from './product_variant.schema';
import { Inject } from '@nestjs/common';
import { REPOSITORY } from '@common/constant';
import Repository from '@common/core/repository';

@AppService()
export class ProductVariantService extends ACoreService<ProductVariant> {
   constructor(@Inject(REPOSITORY) protected readonly repository: Repository<ProductVariant>) {
      super();
   }
}
