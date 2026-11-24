import { Module } from '@nestjs/common';
import { SalesReturnController } from './sales-return.controller.js';
import { SalesReturnService } from './sales-return.service.js';

@Module({
  controllers: [SalesReturnController],
  providers: [SalesReturnService]
})
export class SalesReturnModule {}
