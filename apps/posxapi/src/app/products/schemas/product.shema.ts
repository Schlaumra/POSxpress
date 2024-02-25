import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Ingredient } from '@px/interface';
import { HydratedDocument } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

@Schema()
export class Product {
  @Prop()
  name: string;
  @Prop()
  price: number;
  @Prop()
  tags: string[];
  @Prop()
  inStock: boolean;
  @Prop()
  ingredients?: Ingredient[]; // TODO add Ingredient Schema
  @Prop({})
  info?: string;
  @Prop()
  note?: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
