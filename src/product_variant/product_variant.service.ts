import AppService from '@common/decorator/app_service.decorator';
import BaseService from '@common/core/base/base.service';
import { ProductVariant } from './product_variant.schema';
import { BadRequestException } from '@nestjs/common';
import { CreateProductVariantDto } from './product_variant.dto';
import FieldService from '../field/field.service';
import ProductService from '../product/product.service';
import CategoryService from '@shared/category/category.service';

@AppService()
export class ProductVariantService extends BaseService<ProductVariant> {
   constructor(
      private readonly productService: ProductService,
      private readonly fieldService: FieldService,
      private readonly categoryService: CategoryService,
   ) {
      super();
   }

   async create({ productId, tagsDto, type, metaValue: mv, ...dto }: CreateProductVariantDto) {
      const { data: product } = await this.productService.findById({ id: productId });
      const repository = await this.getRepository();
      if (!product.meta[type]) throw new BadRequestException('Invalid variant type');
      const tags = [];
      const metaValue = {};

      for (const fieldId of product.meta[type]) {
         await this.fieldService.validateField({ id: fieldId, value: mv[fieldId] });
         metaValue[fieldId] = mv[fieldId];
      }

      if (tagsDto)
         for (const tg of tagsDto) {
            const { data: tag } = await this.categoryService.getCategory(tg);
            tags.push(tag);
         }

      return repository.create({ product, tags, type, metaValue, ...dto });
   }
}
