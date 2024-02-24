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