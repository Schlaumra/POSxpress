import { PartialType } from '@nestjs/mapped-types';
import { Printer } from '../schemas/printer.shema'

export class UpdatePrinterDto extends PartialType(Printer) {}
