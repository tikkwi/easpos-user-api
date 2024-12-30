import { Module } from '@nestjs/common';
import { ProductSchema } from './product.schema';
import ProductController from './product.controller';
import ProductService from './product.service';
import { SCHEMA } from '@common/constant';

@Module({
   controllers: [ProductController],
   providers: [ProductService, { provide: SCHEMA, useValue: ProductSchema }],
   exports: [ProductService],
})
export default class ProductModule {}
