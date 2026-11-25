import { BadRequestException, ConflictException, ForbiddenException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePagination, CreateSearchRegex, MongooseExceptionError } from '../../common/helpers/common.helper.js';
import { CreateCustomersDto, CustomersQueryDto, UpdateCustomersDto } from './customers.dto.js';
import { Customers, CustomersDocument } from './customers.schema.js';
import { Model, QueryFilter, isObjectIdOrHexString } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class CustomersService {
    constructor(
        @InjectModel(Customers.name) private readonly CustomersModel: Model<CustomersDocument>
    ) { }

    async create(payload: CreateCustomersDto) {
        try {
            const [findCustomersByEmail, findCustomersByPhone] = await Promise.all([
                this.CustomersModel.exists({ customer_email: { $regex: `^${CreateSearchRegex(payload.customer_email)}$`, $options: 'i' } }),
                this.CustomersModel.exists({ customer_phone: { $regex: `^${CreateSearchRegex(payload.customer_phone)}$`, $options: 'i' } }),
            ])

            if (findCustomersByEmail) throw new ConflictException('Email Already Exists');
            if (findCustomersByPhone) throw new ConflictException('Phone Already Exists');

            const response = await this.CustomersModel.create({
                customer_name: payload.customer_name,
                customer_phone: payload.customer_phone,
                customer_email: payload.customer_email,
                customer_address: payload.customer_address
            });

            if (response) {
                return {
                    success: true,
                    message: "Customers Created Success",
                    payload: response
                }
            }

        } catch (error: any) {
            if (error instanceof HttpException) throw error;
            try { MongooseExceptionError(error) } catch (err) { if (err instanceof HttpException) throw err }
            throw new InternalServerErrorException(error.message ?? "Internal Server Error");
        }
    }

    async show(query: CustomersQueryDto) {
        const { limit, page, search, status } = query;
        const filter: QueryFilter<CustomersDocument> = {};

        try {
            if (search) { filter.$or = [{ supplier_name: { $regex: CreateSearchRegex(search), $options: 'i' } }] }
            if (status && ["active", "inactive"].includes(status)) { filter.status = status };

            const [response, count] = await Promise.all([
                this.CustomersModel.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
                this.CustomersModel.countDocuments(filter)
            ]);

            if (response) {
                return {
                    success: response.length > 0 ? true : false,
                    message: response.length > 0 ? "Customers Fetched Success" : "Customers Not Found",
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
            const response = await this.CustomersModel.findById(id).lean();
            if (!response) throw new NotFoundException('Customers Not Found By ID')

            if (response) {
                return {
                    success: true,
                    message: "Customers Fetched Success",
                    payload: response
                }
            }

        } catch (error: any) {
            if (error instanceof HttpException) throw error;
            throw new InternalServerErrorException(error.message ?? "Internal Server Error");
        }
    }

    async update(id: string, payload: UpdateCustomersDto) {
        try {
            if (!isObjectIdOrHexString(id)) throw new BadRequestException('Invalid Customers ID');
            const [findCustomersById, findCustomersByEmail, findCustomersByPhone] = await Promise.all([
                this.CustomersModel.findById(id).lean(),
                this.CustomersModel.exists({ customer_email: { $regex: `^${CreateSearchRegex(payload.customer_email)}$`, $options: 'i' }, _id: { $ne: id } }),
                this.CustomersModel.exists({ customer_phone: { $regex: `^${CreateSearchRegex(payload.customer_phone)}$`, $options: 'i' }, _id: { $ne: id } }),
            ])

            if (!findCustomersById) throw new NotFoundException('Customers Not Found By ID');
            if (findCustomersByEmail) throw new ConflictException('Customers Email Already Exists');
            if (findCustomersByPhone) throw new ConflictException('Customers Phone Already Exists');

            const response = await this.CustomersModel.findByIdAndUpdate(id, {
                customer_name: payload.customer_name,
                customer_phone: payload.customer_phone,
                customer_email: payload.customer_email,
                customer_address: payload.customer_address,
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
}
