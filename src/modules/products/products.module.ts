import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller.js';
import { ProductsService } from './products.service.js';
import { MongooseModule } from '@nestjs/mongoose';
import { Products, ProductsSchema } from './products.schema.js';
import { CategoriesModule } from '../categories/categories.module.js';
import { UnittypesModule } from '../unittypes/unittypes.module.js';

@Module({
  imports: [CategoriesModule, UnittypesModule, MongooseModule.forFeature([{ name: Products.name, schema: ProductsSchema }])],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [MongooseModule]
})
export class ProductsModule { }
