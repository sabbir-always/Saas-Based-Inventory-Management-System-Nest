import { Module } from '@nestjs/common';
import { UnittypesController } from './unittypes.controller.js';
import { UnittypesService } from './unittypes.service.js';
import { MongooseModule } from '@nestjs/mongoose';
import { Unittypes, UnittypesSchema } from './unittypes.schema.js';

@Module({
  imports: [MongooseModule.forFeature([{ name: Unittypes.name, schema: UnittypesSchema }])],
  controllers: [UnittypesController],
  providers: [UnittypesService],
  exports: [MongooseModule]
})
export class UnittypesModule { }
