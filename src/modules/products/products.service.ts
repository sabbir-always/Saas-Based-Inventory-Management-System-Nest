import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Products, ProductsDocument } from './products.schema.js';
import { Categories, CategoriesDocument } from '../categories/categories.schema.js';
import { Unittypes, UnittypesDocument } from '../unittypes/unittypes.schema.js';
import { Model } from 'mongoose';

@Injectable()
export class ProductsService {
    constructor(
        @InjectModel(Products.name) private readonly ProductsModel: Model<ProductsDocument>,
        @InjectModel(Categories.name) private readonly CategoriesModel: Model<CategoriesDocument>,
        @InjectModel(Unittypes.name) private readonly UnittypesModel: Model<UnittypesDocument>,
    ) { }
}
