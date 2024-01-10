import { PrinterModel, PrinterSettings, Status } from "libs/interface"

export class CreatePrinterDto {
    name: string
    address: string
    tags: string[]
    model: PrinterModel
    settings?: PrinterSettings
    status?: Status
}
