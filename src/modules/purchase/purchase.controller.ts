import { CreatePurchaseDto, PurchaseQueryDto, UpdatePurchaseDto } from './purchase.dto.js';
import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { MongooseObjectIdPipe } from '../../common/pipes/mongoose-object-id.pipe.js';
import { PurchaseService } from './purchase.service.js';

@Controller('purchase')
export class PurchaseController {
    constructor(private readonly Purchase: PurchaseService) { }

    @Post()
    create(@Body() payload: CreatePurchaseDto) {
        return this.Purchase.create(payload);
    }

    @Get()
    show(@Query() query: PurchaseQueryDto) {
        return this.Purchase.show(query);
    }

    @Get(':id')
    read(@Param('id', MongooseObjectIdPipe) id: string) {
        return this.Purchase.read(id);
    }

    @Put(':id')
    update(@Param('id', MongooseObjectIdPipe) id: string, @Body() payload: UpdatePurchaseDto) {
        return this.Purchase.update(id, payload);
    }

    @Delete(':id')
    remove(@Param('id', MongooseObjectIdPipe) id: string) {
        return this.Purchase.remove(id);
    }
}