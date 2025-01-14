import AppService from '@common/decorator/app_service.decorator';
import BaseService from '@common/core/base/base.service';
import { ProductVariant } from './product_variant.schema';
import { BadRequestException } from '@nestjs/common';
import { CreateProductVariantDto } from './product_variant.dto';
import FieldService from '../field/field.service';
import ProductService from '../product/product.service';
import CategoryService from '@shared/category/category.service';
import { ModuleRef } from '@nestjs/core';

@AppService()
export class ProductVariantService extends BaseService<ProductVariant> {
   constructor(
      protected readonly moduleRef: ModuleRef,
      private readonly productService: ProductService,
      private readonly fieldService: FieldService,
      private readonly categoryService: CategoryService,
   ) {
      super();
   }

   async create({ ctx, productId, tagsDto, type, metaValue: mv, ...dto }: CreateProductVariantDto) {
      const { data: product } = await this.productService.findById({ ctx, id: productId });
      const repository = await this.getRepository(ctx.connection, ctx.session);
      if (!product.meta[type]) throw new BadRequestException('Invalid variant type');
      const tags = [];
      const metaValue = {};

      for (const fieldId of product.meta[type]) {
         await this.fieldService.validateField({ ctx, id: fieldId, value: mv[fieldId] });
         metaValue[fieldId] = mv[fieldId];
      }

      if (tagsDto)
         for (const tg of tagsDto) {
            const { data: tag } = await this.categoryService.getCategory({ ctx, ...tg });
            tags.push(tag);
         }

      return repository.create({ product, tags, type, metaValue, ...dto });
   }
}
