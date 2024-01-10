import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Role } from 'libs/interface';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
    @Prop()
    name: string;
    
    @Prop()
    hashedPassword: string;
    
    @Prop()
    password?: string;
    
    @Prop()
    roles: Role[];
    
    @Prop()
    tags: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);