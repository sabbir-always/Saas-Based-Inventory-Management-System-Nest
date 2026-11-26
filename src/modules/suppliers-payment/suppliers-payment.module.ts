import { SupplierPayment, SupplierPaymentSchema } from './suppliers-payment.schema.js';
import { SuppliersPaymentController } from './suppliers-payment.controller.js';
import { Suppliers, SuppliersSchema } from '../suppliers/suppliers.schema.js';
import { Purchase, PurchaseSchema } from '../purchase/purchase.schema.js';
import { SuppliersPaymentService } from './suppliers-payment.service.js';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';

@Module({
  imports: [MongooseModule.forFeature([{ name: SupplierPayment.name, schema: SupplierPaymentSchema }, { name: Purchase.name, schema: PurchaseSchema }, { name: Suppliers.name, schema: SuppliersSchema }])],
  controllers: [SuppliersPaymentController],
  providers: [SuppliersPaymentService]
})
export class SuppliersPaymentModule { }
