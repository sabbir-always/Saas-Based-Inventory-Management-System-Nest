import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
export type CategoriesDocument = HydratedDocument<Categories>;

@Schema({ timestamps: true })
export class Categories {
    @Prop({ type: String, required: true, trim: true, unique: true, minLength: 3, maxLength: 30 })
    categories_name: string;

    @Prop({ type: Number, min: 0, default: 0 })
    number_of_products: number; //auto-complete

    @Prop({ type: String, enum: ['active', 'inactive'], default: 'inactive' })
    status: 'active' | 'inactive';
}

export const CategoriesSchema = SchemaFactory.createForClass(Categories);