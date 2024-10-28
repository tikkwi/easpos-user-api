import CoreService from '@common/core/core.service';
import { CreateProductDto } from './product.dto';
import Product from './product.schema';
import { ECategory } from '@common/utils/enum';
import AppService from '@common/decorator/app_service.decorator';
import { Inject } from '@nestjs/common';
import { REPOSITORY } from '@common/constant';
import Repository from '@common/core/repository';
import { FindByCodeDto } from '@common/dto/core.dto';

@AppService()
export default class ProductService extends CoreService<Product> {
   constructor(
      @Inject(REPOSITORY) protected readonly repository: Repository<Product>,
      private readonly category: CategoryService,
   ) {
      super();
   }

   async getProduct({ code }: FindByCodeDto) {
      return this.repository.findOne({
         filter: { qrCode: code },
         errorOnNotFound: true,
      });
   }

   async createProduct({ tags: tagDto, unitId, category, context, ...dto }: CreateProductDto) {
      const tags = [];
      if (tagDto) {
         for (const tag of tagDto) {
            tags.push(
               (
                  await context.get('categoryService').getCategory({
                     ...tag,
                     type: ECategory.ProductTag,
                  })
               ).data,
            );
         }
      }
      const unit = unitId
         ? (
              await context.get('categoryService').findById({
                 id: unitId,
                 errorOnNotFound: true,
              })
           ).data
         : undefined;
      return await super.create({
         ...dto,
         tags,
         unit,
         category: { ...category, type: ECategory.Product },
      });
   }
}
