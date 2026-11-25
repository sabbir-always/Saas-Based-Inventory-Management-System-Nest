import { CreateSuppliersDto, SuppliersQueryDto, UpdateSuppliersDto } from './suppliers.dto.js';
import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { MongooseObjectIdPipe } from '../../common/pipes/mongoose-object-id.pipe.js';
import { SuppliersService } from './suppliers.service.js';

@Controller('suppliers')
export class SuppliersController {
    constructor(private readonly Suppliers: SuppliersService) { }

    @Post()
    create(@Body() payload: CreateSuppliersDto) {
        return this.Suppliers.create(payload);
    }

    @Get()
    show(@Query() query: SuppliersQueryDto) {
        return this.Suppliers.show(query);
    }

    @Get(':id')
    read(@Param('id', MongooseObjectIdPipe) id: string) {
        return this.Suppliers.read(id);
    }

    @Put(':id')
    update(@Param('id', MongooseObjectIdPipe) id: string, @Body() payload: UpdateSuppliersDto) {
        return this.Suppliers.update(id, payload);
    }

    @Delete(':id')
    remove(@Param('id', MongooseObjectIdPipe) id: string) {
        return this.Suppliers.remove(id);
    }
}
