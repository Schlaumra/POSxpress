import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SettingsDocument = HydratedDocument<Settings>;

@Schema()
export class Settings {
    @Prop()
    version: number
    @Prop()
    tables: number
    @Prop()
    tags: string[]
}

export const SettingsSchema = SchemaFactory.createForClass(Settings);