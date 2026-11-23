import { BadRequestException, ConflictException, ForbiddenException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePagination, CreateSearchRegex, MongooseExceptionError } from '../../common/helpers/common.helper.js';
import { CreateUnittypesDto, UnittypesQueryDto, UpdateUnittypesDto } from './unittypes.dto.js';
import { Products, ProductsDocument } from '../products/products.schema.js';
import { isObjectIdOrHexString, Model, QueryFilter } from 'mongoose';
import { Unittypes, UnittypesDocument } from './unittypes.schema.js';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UnittypesService {
    constructor(
        @InjectModel(Unittypes.name) private readonly UnittypesModel: Model<UnittypesDocument>,
        @InjectModel(Products.name) private readonly ProductsModel: Model<ProductsDocument>
    ) { }

    async create(payload: CreateUnittypesDto) {
        try {
            const findUnittypesByName = await this.UnittypesModel.exists({ unittypes_name: { $regex: `^${CreateSearchRegex(payload.unittypes_name)}$`, $options: 'i' } });
            if (findUnittypesByName) throw new ConflictException('Unittypes Name Already Exists');

            const response = await this.UnittypesModel.create({
                unittypes_name: payload.unittypes_name
            });

            if (response) {
                return {
                    success: true,
                    message: "Unittypes Created Success",
                    payload: response
                }
            }

        } catch (error: any) {
            if (error instanceof HttpException) throw error;
            try { MongooseExceptionError(error) } catch (err) { if (err instanceof HttpException) throw err }
            throw new InternalServerErrorException(error.message ?? "Internal Server Error");
        }
    }

    async show(query: UnittypesQueryDto) {
        const { limit, page, search, status } = query;
        const filter: QueryFilter<UnittypesDocument> = {};

        try {
            if (search) { filter.$or = [{ unittypes_name: { $regex: CreateSearchRegex(search), $options: 'i' } }] }
            if (status && ["active", "inactive"].includes(status)) { filter.status = status };

            const [response, count] = await Promise.all([
                this.UnittypesModel.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
                this.UnittypesModel.countDocuments(filter)
            ]);

            if (response) {
                return {
                    success: response.length > 0 ? true : false,
                    message: response.length > 0 ? "Unittypes Fetched Success" : "Unittypes Not Found",
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
            if (!isObjectIdOrHexString(id)) throw new BadRequestException('Invalid Unittypes ID');
            const response = await this.UnittypesModel.findById(id).lean();
            if (!response) throw new NotFoundException('Unittypes Not Found By ID')

            if (response) {
                return {
                    success: true,
                    message: "Unittypes Fetched Success",
                    payload: response
                }
            }

        } catch (error: any) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException(error.message ?? "Internal Server Error");
        }
    }

    async update(id: string, payload: UpdateUnittypesDto) {
        try {
            if (!isObjectIdOrHexString(id)) throw new BadRequestException('Invalid Unittypes ID');
            const [findUnittypesById, findUnittypesName] = await Promise.all([
                this.UnittypesModel.findById(id).lean(),
                this.UnittypesModel.exists({ unittypes_name: { $regex: `^${CreateSearchRegex(payload.unittypes_name)}$`, $options: 'i' }, _id: { $ne: id } }),
            ])

            if (!findUnittypesById) throw new NotFoundException('Unittypes Not Found By ID');
            if (findUnittypesName) throw new ConflictException('Unittypes Name Already Exists');

            const response = await this.UnittypesModel.findByIdAndUpdate(id, {
                unittypes_name: payload.unittypes_name,
                status: payload.status
            }, { new: true, runValidators: true });

            if (response) {
                return {
                    success: true,
                    message: "Unittypes Updated Success",
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
            if (!isObjectIdOrHexString(id)) throw new BadRequestException('Invalid Unittypes ID');
            const [findUnittypesById, UnittypesHasProduct] = await Promise.all([
                this.UnittypesModel.findById(id).lean(),
                this.ProductsModel.exists({ unittypes_id: id })
            ]);

            if (!findUnittypesById) throw new NotFoundException('Unittypes Not Found By ID');
            if (UnittypesHasProduct) throw new ConflictException('Unittypes Has Product, Delete Or Move Them First');
            if (findUnittypesById.status === "active") throw new ForbiddenException('Cannot Delete Active Unittypes. Please Deactivate First.');

            const response = await this.UnittypesModel.findByIdAndDelete(id).lean();

            if (response) {
                return {
                    success: true,
                    message: "Unittypes Deleted Success"
                }
            }
        } catch (error: any) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException(error.message ?? "Internal Server Error");
        }
    }
}
