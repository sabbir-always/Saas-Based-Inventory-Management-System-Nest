import { ConflictException, HttpException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateSearchRegex, MongooseExceptionError } from '../../common/helpers/error.helper.js';
import { Products, ProductsDocument } from '../products/products.schema.js';
import { Categories, CategoriesDocument } from './categories.schema.js';
import { CreateCategoriesDto } from './categories.dto.js';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectModel(Categories.name) private readonly CategoriesModel: Model<CategoriesDocument>,
        @InjectModel(Products.name) private readonly ProductsModel: Model<ProductsDocument>
    ) { }

    async create(payload: CreateCategoriesDto) {
        try {
            const findCategoriesByName = await this.CategoriesModel.exists({ categories_name: { $regex: `^${CreateSearchRegex(payload.categories_name)}$`, $options: 'i' } });
            if (findCategoriesByName) throw new ConflictException('Categories Name Already Exists');

            const response = await this.CategoriesModel.create({
                categories_name: payload.categories_name
            });

            if (response) {
                return {
                    success: true,
                    message: "Categories Created Success",
                    payload: response
                }
            }

        } catch (error: any) {
            if (error instanceof HttpException) throw error;
            try { MongooseExceptionError(error) } catch (err) { if (err instanceof HttpException) throw err }
            throw new InternalServerErrorException(error.message ?? "Internal Server Error");
        }
    }
}
