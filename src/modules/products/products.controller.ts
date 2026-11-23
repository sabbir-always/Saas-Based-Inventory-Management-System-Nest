import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { MongooseObjectIdPipe } from '../../common/pipes/mongoose-object-id.pipe.js';
import { ProductsService } from './products.service.js';
import { CreateProductDto, ProductQueryDto } from './products.dto.js';

@Controller('products')
export class ProductsController {
    constructor(private readonly Products: ProductsService) { }

    @Post()
    create(@Body() payload: CreateProductDto) {
        return this.Products.create(payload);
    }

    @Get()
    show(@Query() query: ProductQueryDto) {
        return this.Products.show(query);
    }
}
