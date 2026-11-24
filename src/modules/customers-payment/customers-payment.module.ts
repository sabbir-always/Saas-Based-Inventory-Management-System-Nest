import { Module } from '@nestjs/common';
import { CustomersPaymentController } from './customers-payment.controller.js';
import { CustomersPaymentService } from './customers-payment.service.js';

@Module({
  controllers: [CustomersPaymentController],
  providers: [CustomersPaymentService]
})
export class CustomersPaymentModule {}
