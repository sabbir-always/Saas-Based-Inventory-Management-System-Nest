import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller.js';
import { CategoriesService } from './categories.service.js';
import { MongooseModule } from '@nestjs/mongoose';
import { Categories, CategoriesSchema } from './categories.schema.js';

@Module({
  imports: [MongooseModule.forFeature([{ name: Categories.name, schema: CategoriesSchema }])],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [MongooseModule]
})
export class CategoriesModule { }
