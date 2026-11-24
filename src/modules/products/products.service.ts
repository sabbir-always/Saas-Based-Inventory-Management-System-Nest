import { BadRequestException, ConflictException, ForbiddenException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePagination, CreateSearchRegex, MongooseExceptionError } from '../../common/helpers/common.helper.js';
import { CreateProductDto, ProductQueryDto, UpdateProductDto } from './products.dto.js';
import { Categories, CategoriesDocument } from '../categories/categories.schema.js';
import { Unittypes, UnittypesDocument } from '../unittypes/unittypes.schema.js';
import { Purchase, PurchaseDocument } from '../purchase/purchase.schema.js';
import { isObjectIdOrHexString, Model, QueryFilter } from 'mongoose';
import { Products, ProductsDocument } from './products.schema.js';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ProductsService {
    constructor(
        @InjectModel(Products.name) private readonly ProductModel: Model<ProductsDocument>,
        @InjectModel(Categories.name) private readonly CategoriesModel: Model<CategoriesDocument>,
        @InjectModel(Unittypes.name) private readonly UnittypesModel: Model<UnittypesDocument>,
        @InjectModel(Purchase.name) private readonly PurchaseModel: Model<PurchaseDocument>
    ) { }

    async create(payload: CreateProductDto) {
        try {
            const [findProductByModel, findCategoriesById, findUnittypesById] = await Promise.all([
                this.ProductModel.exists({ product_model: { $regex: `^${CreateSearchRegex(payload.product_model)}$`, $options: 'i' } }),
                this.CategoriesModel.findById(payload.categories_id).lean(),
                this.UnittypesModel.findById(payload.unittypes_id).lean()
            ])

            if (findProductByModel) throw new ConflictException('Product Model Name Already Exists');
            if (!findCategoriesById) throw new NotFoundException('Categories Not Found By ID');
            if (!findUnittypesById) throw new NotFoundException('Unittypes Not Found By ID');

            const response = await this.ProductModel.db.transaction(async (session) => {
                const [product] = await this.ProductModel.create([{
                    product_model: payload.product_model,
                    product_brand: payload.product_brand,
                    product_name: payload.product_name,
                    categories_id: payload.categories_id,
                    unittypes_id: payload.unittypes_id,
                    purchase_price: payload.purchase_price,
                    selling_price: payload.selling_price,
                }], { session });

                await this.CategoriesModel.updateOne({ _id: payload.categories_id }, { $inc: { number_of_products: 1 } }, { session });
                await this.UnittypesModel.updateOne({ _id: payload.unittypes_id }, { $inc: { number_of_products: 1 } }, { session });
                return product
            })

            if (response) {
                return {
                    success: true,
                    message: "Product Created Success",
                    payload: response
                }
            }

        } catch (error: any) {
            if (error instanceof HttpException) throw error;
            try { MongooseExceptionError(error) } catch (err) { if (err instanceof HttpException) throw err }
            throw new InternalServerErrorException(error.message ?? "Internal Server Error");
        }
    }

    async show(query: ProductQueryDto) {
        const { limit, page, search, categories_id, unittypes_id, status } = query;
        const filter: QueryFilter<ProductsDocument> = {};

        try {
            if (search) {
                const regex = { $regex: CreateSearchRegex(search), $options: 'i' };
                filter.$or = [{ product_model: regex }, { product_brand: regex }, { product_name: regex }];
            }
            if (status && ["active", "inactive"].includes(status)) { filter.status = status };
            if (categories_id) {
                if (!isObjectIdOrHexString(categories_id)) throw new BadRequestException('Invalid Categories ID');
                filter.categories_id = categories_id;
            }
            if (unittypes_id) {
                if (!isObjectIdOrHexString(unittypes_id)) throw new BadRequestException('Invalid Unittypes ID');
                filter.unittypes_id = unittypes_id;
            }

            const [products, count] = await Promise.all([
                this.ProductModel.find(filter)
                    .populate('categories_id', 'categories_name')
                    .populate('unittypes_id', 'unittypes_name')
                    .sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
                this.ProductModel.countDocuments(filter)
            ]);

            const response = products.map(({ categories_id, unittypes_id, ...product }: any) => {
                return {
                    ...product,
                    categories_id: categories_id?._id ?? null,
                    categories_name: categories_id?.categories_name ?? null,
                    unittypes_id: unittypes_id?._id ?? null,
                    unittypes_name: unittypes_id?.unittypes_name ?? null
                }
            })

            if (response) {
                return {
                    success: response.length > 0 ? true : false,
                    message: response.length > 0 ? "Products Fetched Success" : "Products Not Found",
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
            if (!isObjectIdOrHexString(id)) throw new BadRequestException('Invalid Product ID');
            const [response] = await Promise.all([
                this.ProductModel.findById(id).populate('categories_id', 'categories_name').populate('unittypes_id', 'unittypes_name').lean()
            ]);

            if (!response) throw new NotFoundException('Product Not Found By ID')
            const { categories_id, unittypes_id, ...rest } = response as any;

            if (response) {
                return {
                    success: true,
                    message: "Product Fetched Success",
                    payload: {
                        ...rest,
                        categories_id: categories_id?._id ?? null,
                        categories_name: categories_id?.categories_name ?? null,
                        unittypes_id: unittypes_id?._id ?? null,
                        unittypes_name: unittypes_id?.unittypes_name ?? null
                    }
                }
            }

        } catch (error: any) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException(error.message ?? "Internal Server Error");
        }
    }

    async update(id: string, payload: UpdateProductDto) {
        try {
            if (!isObjectIdOrHexString(id)) throw new BadRequestException('Invalid Products ID');
            const [findProductById, findProductByModel, findCategoriesById, findUnittypesById] = await Promise.all([
                this.ProductModel.findById(id).lean(),
                this.ProductModel.exists({ product_model: { $regex: `^${CreateSearchRegex(payload.product_model)}$`, $options: 'i' }, _id: { $ne: id } }),
                this.CategoriesModel.findById(payload.categories_id).lean(),
                this.UnittypesModel.findById(payload.unittypes_id).lean()
            ])

            if (!findProductById) throw new NotFoundException('Product Not Found By ID');
            if (findProductByModel) throw new ConflictException('Product Model Already Exists');
            if (!findCategoriesById) throw new NotFoundException('Categories Not Found By ID');
            if (!findUnittypesById) throw new NotFoundException('Unittypes Not Found By ID');

            const response = await this.ProductModel.db.transaction(async (session) => {
                const product = await this.ProductModel.findByIdAndUpdate(id, {
                    product_model: payload.product_model,
                    product_brand: payload.product_brand,
                    product_name: payload.product_name,
                    categories_id: payload.categories_id,
                    unittypes_id: payload.unittypes_id,
                    purchase_price: payload.purchase_price,
                    selling_price: payload.selling_price,
                    status: payload.status
                }, { new: true, runValidators: true, session }).lean();

                if (payload.categories_id && String(payload.categories_id) !== String(findProductById.categories_id)) {
                    await this.CategoriesModel.updateOne({ _id: findProductById.categories_id }, { $inc: { number_of_products: -1 } }, { session });
                    await this.CategoriesModel.updateOne({ _id: payload.categories_id }, { $inc: { number_of_products: 1 } }, { session });
                }

                if (payload.unittypes_id && String(payload.unittypes_id) !== String(findProductById.unittypes_id)) {
                    await this.UnittypesModel.updateOne({ _id: findProductById.unittypes_id }, { $inc: { number_of_products: -1 } }, { session });
                    await this.UnittypesModel.updateOne({ _id: payload.unittypes_id }, { $inc: { number_of_products: 1 } }, { session });
                }

                return product
            })

            if (response) {
                return {
                    success: true,
                    message: "Product Updated Success",
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
            if (!isObjectIdOrHexString(id)) throw new BadRequestException('Invalid Product ID');
            const [findProductById, ProductHasPurchases] = await Promise.all([
                this.ProductModel.findById(id).lean(),
                this.PurchaseModel.exists({ products_id: id })
            ]);

            if (!findProductById) throw new NotFoundException('Product Not Found By ID');
            if (ProductHasPurchases) throw new ConflictException('Product Has Purchases, Delete Or Move Them First');
            if (findProductById.quantity > 0) throw new ConflictException('Product Has Quantity, Delete Or Move Them First');
            if (findProductById.status === "active") throw new ForbiddenException('Cannot Delete Active Product. Please Deactivate First.');


            const response = await this.ProductModel.db.transaction(async (session) => {
                const product = await this.ProductModel.findByIdAndDelete(id, { session }).lean();
                await this.CategoriesModel.updateOne({ _id: findProductById.categories_id }, { $inc: { number_of_products: -1 } }, { session });
                await this.UnittypesModel.updateOne({ _id: findProductById.unittypes_id }, { $inc: { number_of_products: -1 } }, { session });

                return product
            })

            if (response) {
                return {
                    success: true,
                    message: "Product Removed Success"
                }
            }

        } catch (error: any) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException(error.message ?? "Internal Server Error");
        }
    }
}
