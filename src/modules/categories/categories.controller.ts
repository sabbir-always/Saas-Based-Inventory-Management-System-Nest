import { CategoriesQueryDto, CreateCategoriesDto, UpdateCategoriesDto } from './categories.dto.js';
import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { MongooseObjectIdPipe } from '../../common/pipes/mongoose-object-id.pipe.js';
import { CategoriesService } from './categories.service.js';

@Controller('categories')
export class CategoriesController {
    constructor(private readonly Categories: CategoriesService) { }

    @Post()
    create(@Body() payload: CreateCategoriesDto) {
        return this.Categories.create(payload);
    }

    @Get()
    show(@Query() query: CategoriesQueryDto) {
        return this.Categories.show(query);
    }

    @Get(':id')
    read(@Param('id', MongooseObjectIdPipe) id: string) {
        return this.Categories.read(id);
    }

    @Put(':id')
    update(@Param('id', MongooseObjectIdPipe) id: string, @Body() payload: UpdateCategoriesDto) {
        return this.Categories.update(id, payload);
    }

    @Delete(':id')
    remove(@Param('id', MongooseObjectIdPipe) id: string) {
        return this.Categories.remove(id);
    }
}
