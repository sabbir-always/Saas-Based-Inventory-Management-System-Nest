import { BadRequestException, ConflictException, ForbiddenException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePagination, CreateSearchRegex, MongooseExceptionError } from '../../common/helpers/common.helper.js';
import { CreateSuppliersDto, SuppliersQueryDto, UpdateSuppliersDto } from './suppliers.dto.js';
import { Purchase, PurchaseDocument } from '../purchase/purchase.schema.js';
import { Suppliers, SuppliersDocument } from './suppliers.schema.js';
import { isObjectIdOrHexString } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryFilter } from 'mongoose';

@Injectable()
export class SuppliersService {
    constructor(
        @InjectModel(Suppliers.name) private readonly SupplierModel: Model<SuppliersDocument>,
        @InjectModel(Purchase.name) private readonly PurchaseModel: Model<PurchaseDocument>
    ) { }

    async create(payload: CreateSuppliersDto) {
        try {
            const [findSupplierByEmail, findSupplierByPhone] = await Promise.all([
                this.SupplierModel.exists({ supplier_email: { $regex: `^${CreateSearchRegex(payload.supplier_email)}$`, $options: 'i' } }),
                this.SupplierModel.exists({ supplier_phone: { $regex: `^${CreateSearchRegex(payload.supplier_phone)}$`, $options: 'i' } }),
            ])

            if (findSupplierByEmail) throw new ConflictException('Email Already Exists');
            if (findSupplierByPhone) throw new ConflictException('Phone Already Exists');

            const response = await this.SupplierModel.create({
                supplier_name: payload.supplier_name,
                supplier_phone: payload.supplier_phone,
                supplier_email: payload.supplier_email,
                supplier_address: payload.supplier_address,
                warehouse_name: payload.warehouse_name
            });

            if (response) {
                return {
                    success: true,
                    message: "Supplier Created Success",
                    payload: response
                }
            }

        } catch (error: any) {
            if (error instanceof HttpException) throw error;
            try { MongooseExceptionError(error) } catch (err) { if (err instanceof HttpException) throw err }
            throw new InternalServerErrorException(error.message ?? "Internal Server Error");
        }
    }

    async show(query: SuppliersQueryDto) {
        const { limit, page, search, status } = query;
        const filter: QueryFilter<SuppliersDocument> = {};

        try {
            if (search) { filter.$or = [{ supplier_name: { $regex: CreateSearchRegex(search), $options: 'i' } }] }
            if (status && ["active", "inactive"].includes(status)) { filter.status = status };

            const [response, count] = await Promise.all([
                this.SupplierModel.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
                this.SupplierModel.countDocuments(filter)
            ]);

            if (response) {
                return {
                    success: response.length > 0 ? true : false,
                    message: response.length > 0 ? "Supplier Fetched Success" : "Supplier Not Found",
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
            if (!isObjectIdOrHexString(id)) throw new BadRequestException('Invalid Supplier ID');
            const response = await this.SupplierModel.findById(id).lean();
            if (!response) throw new NotFoundException('Supplier Not Found By ID')

            if (response) {
                return {
                    success: true,
                    message: "Supplier Fetched Success",
                    payload: response
                }
            }

        } catch (error: any) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException(error.message ?? "Internal Server Error");
        }
    }

    async update(id: string, payload: UpdateSuppliersDto) {
        try {
            if (!isObjectIdOrHexString(id)) throw new BadRequestException('Invalid Categories ID');
            const [findSupplierById, findSupplierByEmail, findSupplierByPhone] = await Promise.all([
                this.SupplierModel.findById(id).lean(),
                this.SupplierModel.exists({ supplier_email: { $regex: `^${CreateSearchRegex(payload.supplier_email)}$`, $options: 'i' }, _id: { $ne: id } }),
                this.SupplierModel.exists({ supplier_phone: { $regex: `^${CreateSearchRegex(payload.supplier_phone)}$`, $options: 'i' }, _id: { $ne: id } }),
            ])

            if (!findSupplierById) throw new NotFoundException('Supplier Not Found By ID');
            if (findSupplierByEmail) throw new ConflictException('Supplier Email Already Exists');
            if (findSupplierByPhone) throw new ConflictException('Supplier Phone Already Exists');

            const response = await this.SupplierModel.findByIdAndUpdate(id, {
                supplier_name: payload.supplier_name,
                supplier_phone: payload.supplier_phone,
                supplier_email: payload.supplier_email,
                supplier_address: payload.supplier_address,
                warehouse_name: payload.warehouse_name,
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
            const [findSupplierById, SupplierHasPurchase] = await Promise.all([
                this.SupplierModel.findById(id).lean(),
                this.PurchaseModel.exists({ suppliers_id: id })
            ]);

            if (!findSupplierById) throw new NotFoundException('Supplier Not Found By ID');
            if (SupplierHasPurchase) throw new ConflictException('Supplier Has Purchase, Delete Or Move Them First');
            if (findSupplierById.status === "active") throw new ForbiddenException('Cannot Delete Active Supplier. Please Deactivate First.');

            const response = await this.SupplierModel.findByIdAndDelete(id).lean();

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