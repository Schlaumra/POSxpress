import { Injectable } from '@nestjs/common';
import { UpdatePrinterDto } from './dto/update-printer.dto';
import { CreatePrinterDto } from './dto/create-printer.dto';
import { Printer } from './schemas/printer.shema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from '../orders/schemas/order.schema';
import {
  ThermalPrinter,
  PrinterTypes,
  CharacterSet,
} from 'node-thermal-printer';
import { from, switchMap, throwError } from 'rxjs';
import { AbstractCrudService } from '../../libs';

@Injectable()
export class PrintersService extends AbstractCrudService<
  Printer,
  CreatePrinterDto,
  UpdatePrinterDto
> {
  private networkPrinter: ThermalPrinter = null;
  constructor(@InjectModel(Printer.name) protected model: Model<Printer>) {
    super();
  }

  print(id: string, order: Order) {
    return from(this.model.findById(id)).pipe(
      switchMap((printer: Printer) => {
        if (!this.networkPrinter) {
          this.networkPrinter = new ThermalPrinter({
            type: PrinterTypes.EPSON,
            interface: `tcp://${printer.address}:9100`,
            characterSet: CharacterSet.ISO8859_2_LATIN2,
          });
        }

        return from(this.networkPrinter.isPrinterConnected()).pipe(
          switchMap((connected: boolean) => {
            if (connected) {
              this.networkPrinter.setTextSize(7, 7);
              this.networkPrinter.leftRight(
                'Tisch: ' + order.table,
                'Kellner: ' + order.user
              );
              this.networkPrinter.alignCenter();
              this.networkPrinter.bold(true);
              this.networkPrinter.println('');
              this.networkPrinter.println('POSXPRESS');
              this.networkPrinter.println('');
              this.networkPrinter.bold(false);
              this.networkPrinter.alignLeft();
              this.networkPrinter.drawLine();
              this.networkPrinter.println('');
              this.networkPrinter.println('');

              order.productGroups
                .filter((group) => group.amount > 0)
                .forEach((product) => {
                  this.networkPrinter.println(
                    `${product.amount}x   ${product.name} ${
                      product.product.info || ''
                    }`
                  );

                  if (product.custom) {
                    this.networkPrinter.println('        ' + product.info);
                  }
                });
              this.networkPrinter.println('');
              this.networkPrinter.drawLine();
              this.networkPrinter.cut();
              return from(this.networkPrinter.execute());
            } else {
              return throwError(() => new Error('Printer not connected'));
            }
          })
        );
      })
    );
  }
}
