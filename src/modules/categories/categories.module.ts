import { Products, ProductsSchema } from '../products/products.schema.js';
import { Categories, CategoriesSchema } from './categories.schema.js';
import { CategoriesController } from './categories.controller.js';
import { CategoriesService } from './categories.service.js';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';

@Module({
  imports: [MongooseModule.forFeature([{ name: Categories.name, schema: CategoriesSchema }, { name: Products.name, schema: ProductsSchema }])],
  controllers: [CategoriesController],
  providers: [CategoriesService]
})
export class CategoriesModule { }
