import AppService from '@common/decorator/app_service.decorator';
import ACoreService from '@common/core/core.service';
import { ProductVariant } from './product_variant.schema';
import { BadRequestException, Inject } from '@nestjs/common';
import { REPOSITORY } from '@common/constant';
import Repository from '@common/core/repository';
import { CreateProductVariantDto } from './product_variant.dto';
import FieldService from '../field/field.service';
import ProductService from '../product/product.service';

@AppService()
export class ProductVariantService extends ACoreService<ProductVariant> {
   constructor(
      @Inject(REPOSITORY) protected readonly repository: Repository<ProductVariant>,
      private readonly productService: ProductService,
      private readonly categoryService: CategoryService,
      private readonly fieldService: FieldService,
   ) {
      super();
   }

   async create({ productId, tagsDto, type, metaValue: mv, ...dto }: CreateProductVariantDto) {
      const { data: product } = await this.productService.findById({ id: productId });
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

      return this.repository.create({ product, tags, type, metaValue, ...dto });
   }
}
