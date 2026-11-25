import { Purchase, PurchaseSchema } from '../purchase/purchase.schema.js';
import { Suppliers, SuppliersSchema } from './suppliers.schema.js';
import { SuppliersController } from './suppliers.controller.js';
import { SuppliersService } from './suppliers.service.js';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';

@Module({
  imports: [MongooseModule.forFeature([{ name: Suppliers.name, schema: SuppliersSchema }, { name: Purchase.name, schema: PurchaseSchema }])],
  controllers: [SuppliersController],
  providers: [SuppliersService]
})
export class SuppliersModule { }
