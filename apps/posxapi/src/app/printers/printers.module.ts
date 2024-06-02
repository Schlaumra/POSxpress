import { Module } from '@nestjs/common';
import { PrintersService } from './printers.service';
import { PrintersController } from './printers.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Printer, PrinterSchema } from './schemas/printer.shema';
import {PrintSchedulerService } from './print.scheduler.service'
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Printer.name, schema: PrinterSchema }]),
  ],
  controllers: [PrintersController],
  providers: [PrintersService, PrintSchedulerService],
})
export class PrintersModule {}
