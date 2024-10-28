import AppController from '@common/decorator/app_controller.decorator';
import { EAllowedUser } from '@common/utils/enum';
import CoreController from '@common/core/core.controller';
import ProductService from './product.service';
import { Body, Post } from '@nestjs/common';
import { CreateProductDto } from './product.dto';

@AppController('product', { admin: [EAllowedUser.Admin], user: [EAllowedUser.Merchant] })
export default class ProductController extends CoreController {
   constructor(protected readonly service: ProductService) {
      super();
   }

   @Post('create')
   async create(@Body() dto: CreateProductDto) {
      return this.service.createProduct(dto);
   }
}
