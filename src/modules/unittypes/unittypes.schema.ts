import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
export type UnittypesDocument = HydratedDocument<Unittypes>;

@Schema({ timestamps: true })
export class Unittypes {
    @Prop({ type: String, required: true, trim: true, unique: true, sparse: true, minLength: 3, maxLength: 30 })
    unittypes_name: string;

    @Prop({ type: Number, min: 0, default: 0 })
    number_of_products: number; //auto-complete

    @Prop({ type: String, enum: ['active', 'inactive'], default: 'inactive' })
    status: 'active' | 'inactive';
}

export const UnittypesSchema = SchemaFactory.createForClass(Unittypes);