import { PaymentCategories, ProductGroup } from '@px/interface';

export class CreateOrderDto {
  _id: string;
  table: number;
  user: string;
  productGroups: ProductGroup[];
  printQueue?: [];
  printed: boolean;
  payments?: PaymentCategories;
  payed: boolean;
  timeStarted?: Date;
  timePayed?: Date;
  timePrinted?: Date;
  income?: number;
}
