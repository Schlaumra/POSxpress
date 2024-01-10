import { Payment, ProductGroup } from "libs/interface"

export class CreateOrderDto {
    table: number
    user: string
    productGroups: ProductGroup[]
    printQueue?: []
    printed: boolean
    payments: Payment[]
    payed: boolean
}
