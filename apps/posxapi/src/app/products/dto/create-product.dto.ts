import { Ingredient } from '@px/interface';

export class CreateProductDto {
  position: number;
  name: string;
  price: number;
  tags: string[];
  inStock: boolean;
  ingredients?: Ingredient[];
  info?: string;
  note?: string;
}
