import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller.js';
import { ProductsService } from './products.service.js';
import { MongooseModule } from '@nestjs/mongoose';
import { Products, ProductsSchema } from './products.schema.js';
import { Categories, CategoriesSchema } from '../categories/categories.schema.js';
import { Unittypes, UnittypesSchema } from '../unittypes/unittypes.schema.js';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Products.name, schema: ProductsSchema },
    { name: Categories.name, schema: CategoriesSchema },
    { name: Unittypes.name, schema: UnittypesSchema }
  ])],
  controllers: [ProductsController],
  providers: [ProductsService]
})
export class ProductsModule { }
