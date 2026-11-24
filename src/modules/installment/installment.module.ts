import { Module } from '@nestjs/common';
import { InstallmentController } from './installment.controller.js';
import { InstallmentService } from './installment.service.js';

@Module({
  controllers: [InstallmentController],
  providers: [InstallmentService]
})
export class InstallmentModule {}
