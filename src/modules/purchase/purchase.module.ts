import { Products, ProductsSchema } from '../products/products.schema.js';
import { Purchase, PurchaseSchema } from './purchase.schema.js';
import { PurchaseController } from './purchase.controller.js';
import { PurchaseService } from './purchase.service.js';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';

@Module({
  imports: [MongooseModule.forFeature([{ name: Purchase.name, schema: PurchaseSchema }, { name: Products.name, schema: ProductsSchema }])],
  controllers: [PurchaseController],
  providers: [PurchaseService]
})
export class PurchaseModule { }
