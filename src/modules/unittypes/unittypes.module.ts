import { Products, ProductsSchema } from '../products/products.schema.js';
import { Unittypes, UnittypesSchema } from './unittypes.schema.js';
import { UnittypesController } from './unittypes.controller.js';
import { UnittypesService } from './unittypes.service.js';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';

@Module({
  imports: [MongooseModule.forFeature([{ name: Unittypes.name, schema: UnittypesSchema }, { name: Products.name, schema: ProductsSchema }])],
  controllers: [UnittypesController],
  providers: [UnittypesService]
})
export class UnittypesModule { }
