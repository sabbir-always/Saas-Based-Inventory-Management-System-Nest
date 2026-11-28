import { CreateCustomersDto, CustomersQueryDto, UpdateCustomersDto } from './customers.dto.js';
import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { MongooseObjectIdPipe } from '../../common/pipes/mongoose-object-id.pipe.js';
import { CustomersService } from './customers.service.js';

@Controller('customers')
export class CustomersController {
    constructor(private readonly Customers: CustomersService) { }

    @Post()
    create(@Body() payload: CreateCustomersDto) {
        return this.Customers.create(payload);
    }

    @Get()
    show(@Query() query: CustomersQueryDto) {
        return this.Customers.show(query);
    }

    @Get(':id')
    read(@Param('id', MongooseObjectIdPipe) id: string) {
        return this.Customers.read(id);
    }

    @Put(':id')
    update(@Param('id', MongooseObjectIdPipe) id: string, @Body() payload: UpdateCustomersDto) {
        return this.Customers.update(id, payload);
    }

    @Delete(':id')
    remove(@Param('id', MongooseObjectIdPipe) id: string) {
        return this.Customers.remove(id);
    }
}
