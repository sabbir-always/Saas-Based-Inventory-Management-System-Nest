import { Categories, CategoriesSchema } from '../categories/categories.schema.js';
import { Unittypes, UnittypesSchema } from '../unittypes/unittypes.schema.js';
import { Purchase, PurchaseSchema } from '../purchase/purchase.schema.js';
import { Products, ProductsSchema } from './products.schema.js';
import { ProductsController } from './products.controller.js';
import { ProductsService } from './products.service.js';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';

@Module({
  imports: [MongooseModule.forFeature([{ name: Products.name, schema: ProductsSchema }, { name: Categories.name, schema: CategoriesSchema }, { name: Unittypes.name, schema: UnittypesSchema }, { name: Purchase.name, schema: PurchaseSchema }])],
  controllers: [ProductsController],
  providers: [ProductsService]
})
export class ProductsModule { }
