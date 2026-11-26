import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
export type SalesDocument = HydratedDocument<Sales>;

@Schema({ timestamps: true })
export class Sales {
    @Prop({ type: Date, default: Date.now })
    date_and_time: Date;

    @Prop({ type: String, default: null })
    date_and_time_formatted: string | null;

    @Prop({ type: Types.ObjectId, ref: 'Customers', required: true })
    customers_id: Types.ObjectId;
}

export const SalesSchema = SchemaFactory.createForClass(Sales);
