import { Categories, CategoriesDocument } from '../categories/categories.schema.js';
import { Unittypes, UnittypesDocument } from '../unittypes/unittypes.schema.js';
import { Products, ProductsDocument } from './products.schema.js';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

@Injectable()
export class ProductsService {
    constructor(
        @InjectModel(Products.name) private readonly ProductModel: Model<ProductsDocument>,
        @InjectModel(Categories.name) private readonly CategoriesModel: Model<CategoriesDocument>,
        @InjectModel(Unittypes.name) private readonly UnittypesModel: Model<UnittypesDocument>,
    ) { }
}
