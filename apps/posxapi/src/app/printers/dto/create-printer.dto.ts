import { PrinterModel, PrinterSettings, Status } from '@px/interface';

export class CreatePrinterDto {
  name: string;
  address: string;
  tags: string[];
  model: PrinterModel;
  settings?: PrinterSettings;
  status?: Status;
}
