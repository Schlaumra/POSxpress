import { ProductGroup } from "../product";

export interface Payment {
    priceToPay: number,
    payedWith: number,
    productGroups?: ProductGroup[],
}