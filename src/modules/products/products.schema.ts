import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
export type ProductsDocument = HydratedDocument<Products>;

@Schema({ timestamps: true })
export class Products {
    @Prop({ type: String, required: true, trim: true, unique: true, minLength: 3, maxLength: 20 })
    product_model: string;

    @Prop({ type: String, required: true, trim: true, minLength: 3, maxLength: 20 })
    product_brand: string;

    @Prop({ type: String, required: true, trim: true, minLength: 3, maxLength: 50 })
    product_name: string;

    @Prop({ type: Types.ObjectId, ref: 'Categories', required: true })
    categories_id: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Unittypes', required: true })
    unittypes_id: Types.ObjectId;

    @Prop({ type: Number, min: 0, default: 0 })
    quantity: number; //auto-complete

    @Prop({ type: Number, min: 0, default: 0 })
    purchase_price: number;

    @Prop({ type: Number, min: 0, default: 0 })
    selling_price: number;

    @Prop({ type: String, enum: ['active', 'inactive'], default: 'inactive' })
    status: 'active' | 'inactive';
}

export const ProductsSchema = SchemaFactory.createForClass(Products);