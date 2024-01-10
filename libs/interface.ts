export interface Ingredient {
    name: string,
    contained: boolean,
    extraPrice: number,
    changed?: boolean
}

export type Role = 'admin' | 'waiter';

// Main Object
export interface User {
    _id?: string;
    name: string;
    hashedPassword: string;
    password?: string;
    roles: Role[];
    tags: string[];
}

export interface LoginUser {
    
}

// Main Object
export interface Product {
    _id?: string;
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
    paperSize: number
}

export const MODELS = [
    { brand: 'Epson', models: ['TM-T20III', 'TM-T30II'] },
    { brand: 'Tickoffice', models: ['RP820-WUE', 'RP0-WUE'] }
]

export type PrinterModel = "Epson TM-T20III" | "Tickoffice RP820-WUE"

// Main Object
export interface Printer {
    _id?: string,
    name: string,
    address: string,
    tags: string[],
    model: PrinterModel
    settings?: PrinterSettings,
    status?: Status
}

export interface Payment {
    priceToPay: number,
    payedWith: number,
    productGroups?: ProductGroup[],
}

// Main Object
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

// Main Object
export interface Settings {
    version: number,
    tables: number,
    tags: string[]
}