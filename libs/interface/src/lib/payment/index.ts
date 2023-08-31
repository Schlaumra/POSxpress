import { ProductGroup } from '../product';

export interface PaymentCategories {
  bestellt: ProductGroup[];
  teil: ProductGroup[];
  bezahlt: ProductGroup[];
}
