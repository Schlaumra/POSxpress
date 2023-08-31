import { PaymentCategories } from '../payment';
import { ProductGroup } from '../product';

// TODO: Create interfaces for order
export const orderEntityName = 'orders';

export interface Order {
  _id?: string;
  table: number;
  user: string; // TODO add to DB
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
