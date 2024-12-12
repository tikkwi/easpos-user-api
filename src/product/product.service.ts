import ACoreService from '@common/core/core.service';
import Product from './product.schema';
import AppService from '@common/decorator/app_service.decorator';
import { Inject } from '@nestjs/common';
import { REPOSITORY } from '@common/constant';
import Repository from '@common/core/repository';

@AppService()
export default class ProductService extends ACoreService<Product> {
   constructor(
      @Inject(REPOSITORY) protected readonly repository: Repository<Product>,
      private readonly category: CategoryService,
   ) {
      super();
   }
}
