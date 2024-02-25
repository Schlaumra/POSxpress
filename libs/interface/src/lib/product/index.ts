import { Ingredient } from '../ingredient';

export const productEntityName = 'products';

interface BaseProduct {
  name: string;
  price: number;
  tags: string[];
  inStock: boolean;
  ingredients?: Ingredient[];
  info?: string;
  note?: string;
}

export type ICreateProduct = BaseProduct;
export type IUpdateProduct = BaseProduct;

export interface IProduct extends BaseProduct {
  _id: string;
}

export interface ProductGroup {
  id: string;
  name: string;
  info?: string;
  custom?: boolean;
  amount: number;
  product: IProduct;
}
