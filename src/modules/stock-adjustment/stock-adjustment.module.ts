import { Module } from '@nestjs/common';
import { StockAdjustmentController } from './stock-adjustment.controller.js';
import { StockAdjustmentService } from './stock-adjustment.service.js';

@Module({
  controllers: [StockAdjustmentController],
  providers: [StockAdjustmentService]
})
export class StockAdjustmentModule {}
