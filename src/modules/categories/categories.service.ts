import { BadRequestException, ConflictException, ForbiddenException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePagination, CreateSearchRegex, MongooseExceptionError } from '../../common/helpers/common.helper.js';
import { CategoriesQueryDto, CreateCategoriesDto, UpdateCategoriesDto } from './categories.dto.js';
import { Products, ProductsDocument } from '../products/products.schema.js';
import { Categories, CategoriesDocument } from './categories.schema.js';
import { isObjectIdOrHexString, Model, QueryFilter } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

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

    async show(query: CategoriesQueryDto) {
        const { limit, page, search, status } = query;
        const filter: QueryFilter<CategoriesDocument> = {};

        try {
            if (search) { filter.$or = [{ categories_name: { $regex: CreateSearchRegex(search), $options: 'i' } }] }
            if (status && ["active", "inactive"].includes(status)) { filter.status = status };

            const [response, count] = await Promise.all([
                this.CategoriesModel.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
                this.CategoriesModel.countDocuments(filter)
            ]);

            if (response) {
                return {
                    success: response.length > 0 ? true : false,
                    message: response.length > 0 ? "Categories Fetched Success" : "Categories Not Found",
                    pagination: CreatePagination(page, limit, count),
                    payload: response
                }
            }

        } catch (error: any) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException(error.message ?? "Internal Server Error");
        }
    }

    async read(id: string) {
        try {
            if (!isObjectIdOrHexString(id)) throw new BadRequestException('Invalid Categories ID');
            const response = await this.CategoriesModel.findById(id).lean();
            if (!response) throw new NotFoundException('Categories Not Found By ID')

            if (response) {
                return {
                    success: true,
                    message: "Categories Fetched Success",
                    payload: response
                }
            }

        } catch (error: any) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException(error.message ?? "Internal Server Error");
        }
    }

    async update(id: string, payload: UpdateCategoriesDto) {
        try {
            if (!isObjectIdOrHexString(id)) throw new BadRequestException('Invalid Categories ID');
            const [findCategoriesById, findCategoriesName] = await Promise.all([
                this.CategoriesModel.findById(id).lean(),
                this.CategoriesModel.exists({ categories_name: { $regex: `^${CreateSearchRegex(payload.categories_name)}$`, $options: 'i' }, _id: { $ne: id } }),
            ])

            if (!findCategoriesById) throw new NotFoundException('Categories Not Found By ID');
            if (findCategoriesName) throw new ConflictException('Categories Name Already Exists');

            const response = await this.CategoriesModel.findByIdAndUpdate(id, {
                categories_name: payload.categories_name,
                status: payload.status
            }, { new: true, runValidators: true });

            if (response) {
                return {
                    success: true,
                    message: "Categories Updated Success",
                    payload: response
                }
            }
        } catch (error: any) {
            if (error instanceof HttpException) throw error;
            try { MongooseExceptionError(error) } catch (err) { if (err instanceof HttpException) throw err }
            throw new InternalServerErrorException(error.message ?? "Internal Server Error");
        }
    }

    async remove(id: string) {
        try {
            if (!isObjectIdOrHexString(id)) throw new BadRequestException('Invalid Categories ID');
            const [findCategoriesById, CategoriesHasProduct] = await Promise.all([
                this.CategoriesModel.findById(id).lean(),
                this.ProductsModel.exists({ categories_id: id })
            ]);

            if (!findCategoriesById) throw new NotFoundException('Categories Not Found By ID');
            if (CategoriesHasProduct) throw new ConflictException('Categories Has Product, Delete Or Move Them First');
            if (findCategoriesById.status === "active") throw new ForbiddenException('Cannot Delete Active Categories. Please Deactivate First.');

            const response = await this.CategoriesModel.findByIdAndDelete(id).lean();

            if (response) {
                return {
                    success: true,
                    message: "Categories Deleted Success"
                }
            }
        } catch (error: any) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException(error.message ?? "Internal Server Error");
        }
    }
}
