import { Payment } from '../payment'
import { ProductGroup } from '../product'

// TODO: Create interfaces for order
export const orderEntityName = 'orders'

export interface Order {
    _id?: string,
    table: number,
    user: string, // TODO add to DB
    productGroups: ProductGroup[]
    printQueue?: [],
    printed: boolean,
    payments: Payment[]
    payed: boolean,
}