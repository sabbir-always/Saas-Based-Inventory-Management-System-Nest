import { Categories, CategoriesSchema } from './categories.schema.js';
import { CategoriesController } from './categories.controller.js';
import { ProductsModule } from '../products/products.module.js';
import { CategoriesService } from './categories.service.js';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';

@Module({
  imports: [ProductsModule, MongooseModule.forFeature([{ name: Categories.name, schema: CategoriesSchema }])],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [MongooseModule]
})
export class CategoriesModule { }
