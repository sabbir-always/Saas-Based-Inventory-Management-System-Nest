import { CreateUnittypesDto, UnittypesQueryDto, UpdateUnittypesDto } from './unittypes.dto.js';
import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { MongooseObjectIdPipe } from '../../common/pipes/mongoose-object-id.pipe.js';
import { UnittypesService } from './unittypes.service.js';

@Controller('unittypes')
export class UnittypesController {
    constructor(private readonly Unittypes: UnittypesService) { }

    @Post()
    create(@Body() payload: CreateUnittypesDto) {
        return this.Unittypes.create(payload);
    }

    @Get()
    show(@Query() query: UnittypesQueryDto) {
        return this.Unittypes.show(query);
    }

    @Get(':id')
    read(@Param('id', MongooseObjectIdPipe) id: string) {
        return this.Unittypes.read(id);
    }

    @Put(':id')
    update(@Param('id', MongooseObjectIdPipe) id: string, @Body() payload: UpdateUnittypesDto) {
        return this.Unittypes.update(id, payload);
    }

    @Delete(':id')
    remove(@Param('id', MongooseObjectIdPipe) id: string) {
        return this.Unittypes.remove(id);
    }
}
