
import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
export type ExpensesDocument = HydratedDocument<Expenses>;

@Schema({ timestamps: true })
export class Expenses {
    @Prop({ type: Date, default: Date.now })
    date_and_time: Date;

    @Prop({ type: String, default: null })
    date_and_time_formatted: string | null;

    @Prop({ type: String, required: true, trim: true, minLength: 3, maxLength: 50 })
    expense_name: string;

    @Prop({ type: Number, min: 0, default: 0 })
    amount: number;

    @Prop({ type: String, required: true, enum: ['cash', 'bkash', 'nagad', 'bank', 'cheque', 'others'] })
    payment_method: 'cash' | 'bkash' | 'nagad' | 'bank' | 'cheque' | 'others';

    @Prop({ type: String, trim: true, minLength: 3, maxLength: 200, default: null, })
    notes: string | null;
}

export const ExpensesSchema = SchemaFactory.createForClass(Expenses);