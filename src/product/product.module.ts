import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import Product, { ProductSchema } from './product.schema';
import ProductController from './product.controller';
import ProductService from './product.service';
import { getRepositoryProvider } from '@common/utils/misc';

@Module({
   imports: [MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }])],
   controllers: [ProductController],
   providers: [ProductService, getRepositoryProvider({ name: Product.name })],
   exports: [ProductService],
})
export default class ProductModule {}
