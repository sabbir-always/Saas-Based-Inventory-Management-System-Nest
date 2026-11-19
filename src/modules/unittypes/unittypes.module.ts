import { Module } from '@nestjs/common';
import { UnittypesController } from './unittypes.controller.js';
import { UnittypesService } from './unittypes.service.js';

@Module({
  controllers: [UnittypesController],
  providers: [UnittypesService]
})
export class UnittypesModule {}
