import { Injectable } from '@nestjs/common';
import { UpdatePrinterDto } from './dto/update-printer.dto';
import { CreatePrinterDto } from './dto/create-printer.dto';
import { Printer } from './schemas/printer.shema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from '../orders/schemas/order.schema';
import {
  ThermalPrinter,
} from 'node-thermal-printer';
import { AbstractCrudService } from '../../libs';
import { PrintSchedulerService } from './print.scheduler.service';

@Injectable()
export class PrintersService extends AbstractCrudService<
  Printer,
  CreatePrinterDto,
  UpdatePrinterDto
> {
  private networkPrinter: ThermalPrinter = null;
  constructor(@InjectModel(Printer.name) protected model: Model<Printer>, private printScheduler: PrintSchedulerService) {
    super();
  }

  print(order: Order) {
    this.printScheduler.schedule(order)
  }
}
