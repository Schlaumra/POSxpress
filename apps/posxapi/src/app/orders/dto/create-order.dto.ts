import { Payment, ProductGroup } from '@px/interface';

export class CreateOrderDto {
  table: number;
  user: string;
  productGroups: ProductGroup[];
  printQueue?: [];
  printed: boolean;
  payments: Payment[];
  payed: boolean;
}
