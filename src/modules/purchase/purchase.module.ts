import { Suppliers, SuppliersSchema } from '../suppliers/suppliers.schema.js';
import { Products, ProductsSchema } from '../products/products.schema.js';
import { Purchase, PurchaseSchema } from './purchase.schema.js';
import { PurchaseController } from './purchase.controller.js';
import { PurchaseService } from './purchase.service.js';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';

@Module({
  imports: [MongooseModule.forFeature([{ name: Purchase.name, schema: PurchaseSchema }, { name: Products.name, schema: ProductsSchema }, { name: Suppliers.name, schema: SuppliersSchema }])],
  controllers: [PurchaseController],
  providers: [PurchaseService]
})
export class PurchaseModule { }
