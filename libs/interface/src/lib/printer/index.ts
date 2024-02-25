export const printerEntityName = 'printers';

export interface Status {
  status: 'Offline' | 'Online';
  msg: string;
}

export interface PrinterSettings {
  paperSize: number;
}

export const MODELS = [
  { brand: 'Epson', models: ['TM-T20III', 'TM-T30II'] },
  { brand: 'Tickoffice', models: ['RP820-WUE', 'RP0-WUE'] },
];

export type PrinterModel = 'Epson TM-T20III' | 'Tickoffice RP820-WUE';

interface BasePrinter {
  name: string;
  address: string;
  tags: string[];
  model: PrinterModel;
  settings?: PrinterSettings;
  status?: Status;
}

export type ICreatePrinter = BasePrinter;
export type IUpdatePrinter = BasePrinter;

export interface IPrinter extends BasePrinter {
  _id: string;
}
