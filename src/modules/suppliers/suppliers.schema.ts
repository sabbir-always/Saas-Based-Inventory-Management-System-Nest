import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
export type SuppliersDocument = HydratedDocument<Suppliers>;

@Schema({ timestamps: true })
export class Suppliers {
    @Prop({ type: Date, default: Date.now })
    date_and_time: Date;

    @Prop({ type: String, default: null })
    date_and_time_formatted: string | null;

    @Prop({ type: String, required: true, trim: true, minlength: 3, maxlength: 50 })
    supplier_name: string;

    @Prop({ type: String, trim: true, required: true, unique: true, minlength: 11, maxlength: 11 })
    supplier_phone: string;

    @Prop({ type: String, trim: true, required: true, unique: true, lowercase: true, minlength: 3, maxlength: 50 })
    supplier_email: string;

    @Prop({ type: String, trim: true, minlength: 3, maxlength: 250 })
    supplier_address: string;

    @Prop({ type: String, trim: true, minlength: 3, maxlength: 250 })
    warehouse_name: string;

    @Prop({ type: Number, min: 0, default: 0 })
    total_purchase_amount: number; //auto-complete

    @Prop({ type: Number, min: 0, default: 0 })
    total_paid_amount: number; //auto-complete

    @Prop({ type: Number, min: 0, default: 0 })
    current_dues_amount: number; //auto-complete

    @Prop({ type: Number, min: 0, default: 0 })
    number_of_purchase: number; //auto-complete

    @Prop({ type: String, enum: ['active', 'inactive'], default: 'inactive' })
    status: 'active' | 'inactive';
}

export const SuppliersSchema = SchemaFactory.createForClass(Suppliers);
