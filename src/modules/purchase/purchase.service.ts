import { BadRequestException, ConflictException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateFormattedDateWithTime, CreatePagination, MongooseExceptionError } from '../../common/helpers/common.helper.js';
import { CreatePurchaseDto, PurchaseQueryDto, UpdatePurchaseDto } from './purchase.dto.js';
import { Suppliers, SuppliersDocument } from '../suppliers/suppliers.schema.js';
import { Purchase, PurchaseDocument } from '../purchase/purchase.schema.js';
import { Products, ProductsDocument } from '../products/products.schema.js';
import { isObjectIdOrHexString, Model, QueryFilter } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PurchaseService {
    constructor(
        @InjectModel(Purchase.name) private readonly PurchaseModel: Model<PurchaseDocument>,
        @InjectModel(Products.name) private readonly ProductModel: Model<ProductsDocument>,
        @InjectModel(Suppliers.name) private readonly SupplierModel: Model<SuppliersDocument>
    ) { }

    private RoundAmount(value: number): number {
        return Number(Number(value).toFixed(2))
    }

    async create(payload: CreatePurchaseDto) {
        try {
            const [findProductById, findSuppliersById] = await Promise.all([
                this.ProductModel.findById(payload.products_id).lean(),
                this.SupplierModel.findById(payload.suppliers_id).lean()
            ]);

            if (!findProductById) throw new NotFoundException('Product Not Found By ID');
            if (!findSuppliersById) throw new NotFoundException('Suppliers Not Found By ID');
            if (findProductById.status !== 'active') throw new ConflictException('Product Is Inactive, Activate It First');
            if (findSuppliersById.status !== 'active') throw new ConflictException('Supplier Is Inactive, Activate It First');

            //-- calculation --//
            const sub_total = this.RoundAmount(payload.quantity * payload.price);
            const shipping_cost = this.RoundAmount(payload.shipping_cost ?? 0);
            const grand_total = this.RoundAmount(sub_total + shipping_cost);

            const response = await this.PurchaseModel.db.transaction(async (session) => {
                const [purchase] = await this.PurchaseModel.create([{
                    date_and_time: payload.date_and_time,
                    date_and_time_formatted: CreateFormattedDateWithTime(payload.date_and_time),
                    products_id: payload.products_id,
                    suppliers_id: payload.suppliers_id,
                    quantity: payload.quantity,
                    price: payload.price ?? 0,
                    sub_total: sub_total,
                    shipping_cost: shipping_cost,
                    grand_total: grand_total,
                    current_dues: grand_total,
                    notes: payload.notes
                }], { session });

                // product synchronization
                const product_response = await this.ProductModel.updateOne({ _id: payload.products_id }, { $inc: { quantity: purchase.quantity } }, { session });
                if (product_response.matchedCount === 0) { throw new NotFoundException('The Product Quantity Could Not Be Updated.') };

                // supplier synchronization
                // const supplier_response = await this.SupplierModel.updateOne({ _id: payload.suppliers_id }, { $inc: { purchase_amount: purchase.grand_total, current_dues: purchase.grand_total, number_of_purchase: 1 } }, { session });
                // if (supplier_response.matchedCount === 0) { throw new NotFoundException('Supplier Not Found By ID') };

                return purchase
            })

            if (response) {
                return {
                    success: true,
                    message: "Purchase Created Success",
                    payload: response
                }
            }

        } catch (error: any) {
            if (error instanceof HttpException) throw error;
            try { MongooseExceptionError(error) } catch (err) { if (err instanceof HttpException) throw err }
            throw new InternalServerErrorException(error.message ?? "Internal Server Error");
        }
    }

    async show(query: PurchaseQueryDto) {
        const { limit, page, search, products_id, suppliers_id } = query;
        const filter: QueryFilter<PurchaseDocument> = {};

        try {
            if (products_id) {
                if (!isObjectIdOrHexString(products_id)) throw new BadRequestException('Invalid Products ID');
                filter.products_id = products_id;
            }
            if (suppliers_id) {
                if (!isObjectIdOrHexString(suppliers_id)) throw new BadRequestException('Invalid Supplier ID');
                filter.suppliers_id = suppliers_id;
            }

            const [purchases, count] = await Promise.all([
                this.PurchaseModel.find(filter)
                    .populate('products_id', 'product_model product_name')
                    .populate('suppliers_id', 'supplier_name')
                    .sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
                this.PurchaseModel.countDocuments(filter)
            ]);

            const response = purchases.map(({ products_id, suppliers_id, ...purchase }: any) => {
                return {
                    ...purchase,
                    products_id: products_id?._id ?? null,
                    product_model: products_id?.product_model ?? null,
                    product_name: products_id?.product_name ?? null,
                    suppliers_id: suppliers_id?._id ?? null,
                    supplier_name: suppliers_id?.supplier_name ?? null
                }
            })

            if (response) {
                return {
                    success: response.length > 0 ? true : false,
                    message: response.length > 0 ? "Purchase Fetched Success" : "Purchase Not Found",
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
            if (!isObjectIdOrHexString(id)) throw new BadRequestException('Invalid Purchase ID');
            const response = await this.PurchaseModel.findById(id)
                .populate('products_id', 'product_model product_name')
                .populate('suppliers_id', 'supplier_name').lean();

            if (!response) throw new NotFoundException('Purchase Not Found By ID')
            const { products_id, suppliers_id, ...rest } = response as any;

            return {
                success: true,
                message: "Purchase Fetched Success",
                payload: {
                    ...rest,
                    products_id: products_id?._id ?? null,
                    product_name: products_id?.product_name ?? null,
                    product_model: products_id?.product_model ?? null,
                    suppliers_id: suppliers_id?._id ?? null,
                    supplier_name: suppliers_id?.supplier_name ?? null
                }
            }

        } catch (error: any) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException(error.message ?? "Internal Server Error");
        }
    }

    async update(id: string, payload: UpdatePurchaseDto) {
        try {
            if (!isObjectIdOrHexString(id)) throw new BadRequestException('Invalid Purchase ID');
            const [findPurchaseById, findProductById, findSuppliersById] = await Promise.all([
                this.PurchaseModel.findById(id).lean(),
                this.ProductModel.findById(payload.products_id).lean(),
                this.SupplierModel.findById(payload.suppliers_id).lean()
            ])

            if (!findPurchaseById) throw new NotFoundException('Purchase Not Found By ID');
            if (!findProductById) throw new NotFoundException('Product Not Found By ID');
            if (!findSuppliersById) throw new NotFoundException('Suppliers Not Found By ID');
            if (findProductById.status !== 'active') throw new ConflictException('Product Is Inactive, Activate It First');
            if (findSuppliersById.status !== 'active') throw new ConflictException('Supplier Is Inactive, Activate It First');

            const response = await this.PurchaseModel.db.transaction(async (session) => {
                //-- calculation --//
                const sub_total = this.RoundAmount(payload.quantity * payload.price);
                const shipping_cost = this.RoundAmount(payload.shipping_cost ?? 0);
                const grand_total = this.RoundAmount(sub_total + shipping_cost);

                const purchase = await this.PurchaseModel.findByIdAndUpdate(id, {
                    products_id: payload.products_id,
                    suppliers_id: payload.suppliers_id,
                    quantity: payload.quantity,
                    price: payload.price ?? findProductById.purchase_price,
                    sub_total: sub_total,
                    shipping_cost: shipping_cost,
                    grand_total: grand_total,
                    current_dues: grand_total,
                    notes: payload.notes
                }, { new: true, runValidators: true, session }).lean();

                return purchase
            })

            if (response) {
                return {
                    success: true,
                    message: "Purchase Updated Success",
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
            if (!isObjectIdOrHexString(id)) throw new BadRequestException('Invalid Purchase ID');

            const response = await this.PurchaseModel.db.transaction(async (session) => {
                const findPurchaseById = await this.PurchaseModel.findById(id).session(session).lean();
                if (!findPurchaseById) throw new NotFoundException('Purchase Not Found By ID');

                const purchase = await this.PurchaseModel.findByIdAndDelete(id, { session }).lean();
                return purchase
            })

            if (response) {
                return {
                    success: true,
                    message: "Purchase Removed Success"
                }
            }

        } catch (error: any) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException('Internal Server Error');
        }
    }
}
