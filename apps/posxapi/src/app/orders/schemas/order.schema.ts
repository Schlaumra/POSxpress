import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Product } from '../../products/schemas/product.shema';

export type OrderDocument = HydratedDocument<Order>;

@Schema()
export class Payment {
  @Prop()
  priceToPay: number;
  @Prop()
  payedWith: number;
  @Prop()
  productGroups?: ProductGroup[];
}

@Schema()
export class ProductGroup {
  @Prop()
  id: string;
  @Prop()
  name: string;
  @Prop()
  info?: string;
  @Prop()
  custom?: boolean;
  @Prop()
  amount: number;
  @Prop()
  product: Product;
}

@Schema()
export class PaymentCategories {
  @Prop()
  bestellt: ProductGroup[];
  @Prop()
  teil: ProductGroup[];
  @Prop()
  bezahlt: ProductGroup[];
}

@Schema()
export class Order {
  @Prop({type: String})
  _id: string;
  @Prop()
  table: number;
  @Prop()
  user: string;
  @Prop()
  productGroups: ProductGroup[];
  @Prop()
  printQueue?: [];
  @Prop()
  failureCount?: number;
  @Prop()
  printed: boolean;
  @Prop()
  payments: PaymentCategories;
  @Prop()
  payed: boolean;
  @Prop()
  timeStarted?: Date;
  @Prop()
  timePayed?: Date;
  @Prop()
  timePrinted?: Date;
  @Prop()
  income?: number;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
