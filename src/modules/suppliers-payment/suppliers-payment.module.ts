import { Module } from '@nestjs/common';
import { SuppliersPaymentController } from './suppliers-payment.controller.js';
import { SuppliersPaymentService } from './suppliers-payment.service.js';

@Module({
  controllers: [SuppliersPaymentController],
  providers: [SuppliersPaymentService]
})
export class SuppliersPaymentModule {}
