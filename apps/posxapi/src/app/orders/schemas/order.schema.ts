import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Product } from '../../products/schemas/product.shema';

export type OrderDocument = HydratedDocument<Order>;

@Schema()
export class Payment {
    @Prop()
    priceToPay: number
    @Prop()
    payedWith: number
    @Prop()
    productGroups?: ProductGroup[]
}

@Schema()
export class ProductGroup {
    @Prop()
    id: string
    @Prop()
    name: string
    @Prop()
    info?: string
    @Prop()
    custom?: boolean
    @Prop()
    amount: number
    @Prop()
    product: Product
}

@Schema()
export class Order {
    @Prop()
    table: number
    @Prop()
    user: string
    @Prop()
    productGroups: ProductGroup[]
    @Prop()
    printQueue?: []
    @Prop()
    printed: boolean
    @Prop()
    payments: Payment[]
    @Prop()
    payed: boolean
}

export const OrderSchema = SchemaFactory.createForClass(Order);