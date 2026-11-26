import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
export type StockAdjustmentDocument = HydratedDocument<StockAdjustment>;


@Schema({ timestamps: true })
export class StockAdjustment {
    @Prop({ type: Date, default: Date.now })
    date_and_time: Date;

    @Prop({ type: String, default: null })
    date_and_time_formatted: string | null;

    @Prop({ type: Types.ObjectId, ref: 'Products', required: true })
    products_id: Types.ObjectId;

    @Prop({ type: Number, required: true, min: 1 })
    quantity: number;

    @Prop({ type: String, required: true, enum: ['resion_1', 'resion_2', 'other'] })
    resion_for_adjustment: 'resion_1' | 'resion_2' | 'other';

    @Prop({ type: String, trim: true, default: null, minLength: 3, maxLength: 200 })
    notes: string | null;
}

export const StockAdjustmentSchema = SchemaFactory.createForClass(StockAdjustment);