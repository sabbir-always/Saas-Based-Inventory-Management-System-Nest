
import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
export type PurchaseDocument = HydratedDocument<Purchase>;

@Schema({ timestamps: true })
export class Purchase {
    @Prop({ type: Date, default: Date.now })
    date_and_time: Date;

    @Prop({ type: String, default: null })
    date_and_time_formatted: string | null;

    @Prop({ type: Types.ObjectId, ref: 'Products', required: true })
    products_id: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Suppliers', required: true })
    suppliers_id: Types.ObjectId;

    @Prop({ type: Number, required: true, min: 1 })
    quantity: number;

    @Prop({ type: Number, min: 0, default: 0 })
    price: number;

    @Prop({ type: Number, min: 0, default: 0 })
    sub_total: number; //auto-complete

    @Prop({ type: Number, min: 0, default: 0 })
    shipping_cost: number;

    @Prop({ type: Number, min: 0, default: 0 })
    grand_total: number; //auto-complete

    @Prop({ type: Number, min: 0, default: 0 })
    current_dues: number; //auto-complete

    @Prop({ type: String, trim: true, default: null, minLength: 3, maxLength: 200 })
    notes: string | null;
}

export const PurchaseSchema = SchemaFactory.createForClass(Purchase);

