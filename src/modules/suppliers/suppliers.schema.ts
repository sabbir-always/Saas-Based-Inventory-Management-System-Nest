
import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
export type SuppliersDocument = HydratedDocument<Suppliers>;

@Schema({ timestamps: true })
export class Suppliers {
    @Prop({ type: String, required: true, trim: true, minlength: 3, maxlength: 50 })
    supplier_name: string;

    @Prop({ type: String, trim: true, unique: true, minlength: 3, maxlength: 20 })
    supplier_phone: string;

    @Prop({ type: String, trim: true, unique: true, lowercase: true, minlength: 3, maxlength: 50 })
    supplier_email: string;

    @Prop({ type: String, trim: true, minlength: 3, maxlength: 250 })
    supplier_address: string;

    @Prop({ type: String, trim: true, minlength: 3, maxlength: 250 })
    warehouse_name: string;

    @Prop({ type: Number, min: 0, default: 0 })
    total_purchase: number;

    @Prop({ type: Number, min: 0, default: 0 })
    total_payments: number;

    @Prop({ type: Number, min: 0, default: 0 })
    current_dues: number;

    @Prop({ type: String, enum: ['active', 'inactive'], default: 'inactive' })
    status: 'active' | 'inactive';
}

export const SuppliersSchema = SchemaFactory.createForClass(Suppliers);
