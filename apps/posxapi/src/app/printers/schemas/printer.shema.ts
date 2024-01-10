import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PrinterDocument = HydratedDocument<Printer>;

@Schema()
class Settings {
    @Prop()
    paperSize: number
}

@Schema()
class Status {
    @Prop()
    status: string
    @Prop()
    msg: string
}

@Schema()
export class Printer {
    @Prop()
    name: string
    @Prop()
    address: string
    @Prop()
    tags: string[]
    @Prop()
    model: string
    settings?: Settings
    @Prop()
    status?: Status
}

export const PrinterSchema = SchemaFactory.createForClass(Printer);