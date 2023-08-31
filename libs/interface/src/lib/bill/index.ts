export interface BillInfo {
    first: Date
    amount: number,
    unpaid: number,
    income: number
}

export type BillProducts = Map<string, {
    amount: number
    price: number
    info?: string
    name?: string
}>

export interface BillGroups {
    [tag: string]: {
        products: BillProducts
        sum: number
    }
}

export type NotPaid = { [name: string]: number }

export interface Bill {
    start: Date
    end: Date
    billGroup: BillGroups
    notPaid: NotPaid
    sum: number
}