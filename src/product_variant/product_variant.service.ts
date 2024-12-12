import AppService from '@common/decorator/app_service.decorator';
import ACoreService from '@common/core/core.service';
import { ProductVariant } from './product_variant.schema';
import { Inject } from '@nestjs/common';
import { REPOSITORY } from '@common/constant';
import Repository from '@common/core/repository';
import { CreateProductVariantDto } from './product_variant.dto';
import { ECategory } from '@common/utils/enum';

@AppService()
export class ProductVariantService extends ACoreService<ProductVariant> {
   constructor(
      @Inject(REPOSITORY) protected readonly repository: Repository<ProductVariant>,
      private readonly categoryService: CategoryService,
   ) {
      super();
   }

   async create({ productId, tagIds, ...dto }: CreateProductVariantDto) {
      await this.findById({ id: productId });
      if (tagIds)
         await this.categoryService.findByIds({ ids: tagIds, type: ECategory.ProductVariantTag });
      return this.repository.create({ product: productId as any, tags: tagIds as any, ...dto });
   }
}
