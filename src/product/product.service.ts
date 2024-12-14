import ACoreService from '@common/core/core.service';
import Product from './product.schema';
import AppService from '@common/decorator/app_service.decorator';
import { BadRequestException, Inject } from '@nestjs/common';
import { REPOSITORY } from '@common/constant';
import Repository from '@common/core/repository';
import { CreateProductDto } from './product.dto';
import UnitService from '@shared/unit/unit.service';
import { isMongoId, isString } from 'class-validator';

@AppService()
export default class ProductService extends ACoreService<Product> {
   constructor(
      @Inject(REPOSITORY) protected readonly repository: Repository<Product>,
      private readonly categoryService: CategoryService,
      private readonly unitService: UnitService,
   ) {
      super();
   }

   async create({ tagsDto, categoryDto, unitId, meta: mta, ...dto }: CreateProductDto) {
      const tags = [];
      const { data: category } = await this.categoryService.getCategory(categoryDto);
      const { data: unit } = await this.unitService.findById({ id: unitId });
      let meta = mta;
      if (tagsDto)
         for (const tg of tagsDto) {
            const { data: tag } = await this.categoryService.getCategory(tg);
            tags.push(tag);
         }
      if (!meta) meta = { default: [] };
      else {
         for (const [k, v] of Object.entries(meta)) {
            if (!isString(k)) throw new BadRequestException('Invalid meta key');
            let valid = true;
            if (!Array.isArray(v)) valid = false;
            if (valid) {
               for (const i of v) {
                  if (!isMongoId(i)) {
                     valid = false;
                     break;
                  }
               }
            }
            if (!valid) throw new BadRequestException('Invalid meta value');
         }
         meta = { ...meta, ...mta };
      }
      return this.repository.create({
         ...dto,
         tags,
         category,
         unit,
         meta,
      });
   }
}
