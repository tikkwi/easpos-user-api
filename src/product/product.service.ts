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

   // async createProduct({ tags: tagDto, unitId, category, context, ...dto }: CreateProductDto) {
   //    const tags = [];
   //    if (tagDto) {
   //       for (const tag of tagDto) {
   //          tags.push(
   //             (
   //                await context.get('categoryService').getCategory({
   //                   ...tag,
   //                   type: ECategory.ProductTag,
   //                })
   //             ).data,
   //          );
   //       }
   //    }
   //    const unit = unitId
   //       ? (
   //            await context.get('categoryService').findById({
   //               id: unitId,
   //               errorOnNotFound: true,
   //            })
   //         ).data
   //       : undefined;
   //    return await super.create({
   //       ...dto,
   //       tags,
   //       unit,
   //       category: { ...category, type: ECategory.Product },
   //    });
   // }
}
