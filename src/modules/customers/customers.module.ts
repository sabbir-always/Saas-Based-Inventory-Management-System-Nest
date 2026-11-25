import { Customers, CustomersSchema } from './customers.schema.js';
import { CustomersController } from './customers.controller.js';
import { CustomersService } from './customers.service.js';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';

@Module({
  imports: [MongooseModule.forFeature([{ name: Customers.name, schema: CustomersSchema }])],
  controllers: [CustomersController],
  providers: [CustomersService]
})
export class CustomersModule { }
