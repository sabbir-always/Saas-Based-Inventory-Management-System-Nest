import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
export type CustomerPaymentDocument = HydratedDocument<CustomerPayment>;

@Schema({ timestamps: true })
export class CustomerPayment {
    @Prop({ type: Date, default: Date.now })
    date_and_time: Date;

    @Prop({ type: String, default: null })
    date_and_time_formatted: string | null;

    @Prop({ type: Types.ObjectId, ref: 'Sales', required: true })
    sales_id: Types.ObjectId;

    @Prop({ type: Number, required: true, min: 1 })
    amount: number;

    @Prop({ type: String, required: true, enum: ['cash', 'bkash', 'nagad', 'bank', 'cheque', 'others'] })
    payment_method: 'cash' | 'bkash' | 'nagad' | 'bank' | 'cheque' | 'others';

    @Prop({ type: String, trim: true, default: null, minLength: 3, maxLength: 200 })
    notes: string | null;
}

export const CustomerPaymentSchema = SchemaFactory.createForClass(CustomerPayment);