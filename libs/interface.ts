export interface Ingredient {
    name: string,
    contained: boolean,
    extraPrice: number,
    changed?: boolean
}

export interface User {
    id: string;
    name: string;
    password: string;
    tags: string[];
}

export interface Product {
    id: string,
    name: string,
    price: number,
    tags: string[],
    inStock: boolean,
    ingredients?: Ingredient[],
    info?: string,
    note?: string
}

export interface ProductGroup {
    id: string,
    name: string,
    info?: string,
    custom?: boolean,
    amount: number,
    product: Product
}

export interface Status {
    status: 'Offline' | 'Online',
    msg: string
}

export interface PrinterSettings {
    papersize: number
}

export const MODELS = [
    { brand: 'Epson', models: ['TM-T20III', 'TM-T30II'] },
    { brand: 'Tickoffice', models: ['RP820-WUE', 'RP0-WUE'] }
]

export interface Printer {
    id: string,
    name: string,
    address: string,
    tags: string[],
    model: "Epson TM-T20III" | "Tickoffice RP820-WUE"
    imgage?: string,
    settings?: PrinterSettings,
    status?: Status
}

export interface Payment {
    priceToPay: number,
    payedWith: number,
    productGroups?: ProductGroup[],
}

export interface Order {
    table: number,
    productGroups: ProductGroup[]
    printQueue?: [],
    printed: boolean,
    payments: Payment[]
    payed: boolean,
}

export interface Settings {
    tables: number
}