
import * as bcrypt from 'bcrypt';
import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
export type UsersDocument = HydratedDocument<Users>;

@Schema({ timestamps: true })
export class Users {
    @Prop({ type: Date, default: Date.now })
    date_and_time: Date;

    @Prop({ type: String, default: null })
    date_and_time_formatted: string | null;

    @Prop({ type: String, required: true, trim: true })
    first_name: string;

    @Prop({ type: String, required: true, trim: true })
    last_name: string;

    @Prop({ type: String, required: true, trim: true, unique: true, sparse: true, lowercase: true })
    email: string;

    @Prop({ type: String, required: true, unique: true, sparse: true, trim: true })
    phone: string;

    @Prop({ type: String, required: true, select: false, set: (value: string) => bcrypt.hashSync(value, bcrypt.genSaltSync(10)) })
    password: string;

    @Prop({ type: String, enum: ['superadmin', 'admin', 'anonymous'], default: 'anonymous' })
    role: 'superadmin' | 'admin' | 'anonymous';

    @Prop({ type: String, enum: ['active', 'inactive'], default: 'inactive' })
    status: 'active' | 'inactive';
}

export const UsersSchema = SchemaFactory.createForClass(Users);