import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CharacterSet,
  PrinterTypes,
  ThermalPrinter,
} from 'node-thermal-printer';
import {
  EMPTY,
  Observable,
  Subscription,
  catchError,
  firstValueFrom,
  from,
  interval,
  switchMap,
} from 'rxjs';
import { Order, ProductGroup } from '../orders/schemas/order.schema';
import { Printer } from './schemas/printer.shema';
import { Bill } from '@px/interface';

function getOrSet<K, D>(key: K, value: D, set: Map<K, D>) {
  const res = set.get(key);
  if (res) return res;
  set.set(key, value);
  return value;
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('de-de', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'Europe/Rome'
  }).format(date)
}

interface PrintQueue {
  subscription: Subscription;
  orders: Order[];
}

@Injectable()
export class PrintSchedulerService {
  private printStore: Map<string, PrintQueue> = new Map();
  private trigger$ = interval(5000);

  private async getPrinterByTag(tag: string) {
    const printer = await this.printerModel.findOne({ tags: tag });
    if (printer) {
      return printer.toObject<Printer>();
    }
    // TODO: This is still a bug, when you want to print something without a printer
    return (await this.printerModel.findOne()).toObject();
  }

  private getPrintQueue(printer: Printer): PrintQueue {
    const printOneByOne = (queue: PrintQueue): Observable<void> => {
      const order = queue.orders.shift();
      if (order) {
        return this.print(order, printer, async () => {
          await firstValueFrom(this.trigger$);
          if (!order.failureCount) order.failureCount = 0;
          order.failureCount += 1;
          if (order.failureCount < 200) {
            queue.orders.push(order);
          } else {
            console.warn('Discarding order', order);
          }
        }).pipe(
          switchMap(() => printOneByOne(queue)),
          catchError((err) => {
            console.error('During printing an error happened: ', err);
            return EMPTY;
          })
        );
      }
      return EMPTY;
    };
    const value: PrintQueue = {
      orders: [],
      subscription: this.trigger$
        .pipe(
          switchMap(() => printOneByOne(value)),
          catchError((err) => {
            console.error('During printing an error happened: ', err);
            return EMPTY;
          })
        )
        .subscribe(),
    };
    return value;
  }

  constructor(
    @InjectModel(Printer.name) protected printerModel: Model<Printer>
  ) {}

  public async schedule(order: Order) {
    const sorted = this.sortByTag(order.productGroups);

    for (const [key, productGroups] of sorted) {
      const filteredOrder: Order = {
        ...order,
        productGroups,
      };
      const printer = await this.getPrinterByTag(key);

      let printerQueue = this.printStore.get(printer._id.toString());
      if (!printerQueue) {
        printerQueue = this.getPrintQueue(printer);
        this.printStore.set(printer._id.toString(), printerQueue);
      }
      printerQueue.orders.push(filteredOrder);
    }
  }

  private sortByTag(productGroups: Order['productGroups']) {
    const result = new Map<string | undefined, ProductGroup[]>();

    productGroups.forEach((productGroup) => {
      if (productGroup.amount > 0) {
        const tag = productGroup.product.tags[0] || undefined;
        getOrSet(tag, [], result).push(productGroup);
      }
    });

    return result;
  }

  public async printBill(bill: Bill) {
    const printer = (await this.printerModel.findOne()).toObject();

    if(printer) {
      console.log('Printing', bill);
      try {
        const networkPrinter = new ThermalPrinter({
          type: PrinterTypes.EPSON,
          interface: `tcp://${printer.address}:9100`,
          characterSet: CharacterSet.ISO8859_2_LATIN2,
        });
  
        return from(networkPrinter.isPrinterConnected()).pipe(
          switchMap((connected: boolean) => {
            if (connected) {
              networkPrinter.alignCenter();
              networkPrinter.println(`${formatDate(bill.start)} - ${formatDate(bill.end)}`);
              networkPrinter.bold(true);
              networkPrinter.println('');
              networkPrinter.println('POSXPRESS');
              networkPrinter.println('Abrechnung');
              networkPrinter.println('');
              networkPrinter.bold(false);
              networkPrinter.alignLeft();
              networkPrinter.drawLine();
              networkPrinter.println('');
  
              Object.entries(bill.billGroup).forEach(([category, billProducts]) => {
                networkPrinter.println(category);
                billProducts.products.forEach((product) => {
                  networkPrinter.leftRight(`    ${product.amount}x ${product.name}`, (product.price).toString());
                  if(product.info) networkPrinter.println(`      ${product.info}`)
                })
                networkPrinter.drawLine();
                networkPrinter.leftRight("Zwischensumme:", billProducts.sum.toString());
                networkPrinter.println('')
              })
  
              networkPrinter.drawLine();
              networkPrinter.println('')
              networkPrinter.println('Nicht bezahlt')
              let notPaidAmount = 0
              Object.entries(bill.notPaid).forEach(([waiter, notPaid]) => {
                networkPrinter.leftRight(`    ${waiter}`, notPaid.toString())
                notPaidAmount -= notPaid
              })
              networkPrinter.drawLine();
              networkPrinter.leftRight("Abzug:", notPaidAmount.toString())
              networkPrinter.println('')
  
              networkPrinter.println('')
              networkPrinter.drawLine();
              networkPrinter.leftRight('Summe', bill.sum.toString())
  
              networkPrinter.cut();
              return from(networkPrinter.execute()).pipe(switchMap(() => EMPTY));
            } else {
              console.error('Printer not connected');
              return EMPTY;
            }
          })
        );
      } catch (err) {
        console.error(err);
        return EMPTY;
      }
    }
  }

  private print(
    order: Order,
    printer: Printer,
    onFailure: () => unknown
  ): Observable<void> {
    console.log('Printing', order);
    try {
      const networkPrinter = new ThermalPrinter({
        type: PrinterTypes.EPSON,
        interface: `tcp://${printer.address}:9100`,
        characterSet: CharacterSet.ISO8859_2_LATIN2,
      });

      return from(networkPrinter.isPrinterConnected()).pipe(
        switchMap((connected: boolean) => {
          if (connected) {
            networkPrinter.leftRight(
              'Tisch: ' + order.table,
              'Kellner: ' + order.user
            );
            networkPrinter.alignCenter();
            networkPrinter.bold(true);
            networkPrinter.println('');
            networkPrinter.println('POSXPRESS');
            networkPrinter.println('');
            networkPrinter.bold(false);
            networkPrinter.alignLeft();
            networkPrinter.drawLine();
            networkPrinter.println('');
            networkPrinter.println('');

            networkPrinter.setTextDoubleWidth();

            order.productGroups
              .filter((group) => group.amount > 0)
              .forEach((product) => {
                networkPrinter.println(
                  `${product.amount}x   ${product.name} ${
                    product.product.info || ''
                  }`
                );

                if (product.custom) {
                  networkPrinter.println('        ' + product.info);
                }
              });
            networkPrinter.println('');
            networkPrinter.setTextNormal();
            networkPrinter.drawLine();
            networkPrinter.alignCenter();
            networkPrinter.println(
              formatDate(new Date())
            );
            networkPrinter.cut();
            return from(networkPrinter.execute()).pipe(switchMap(() => EMPTY));
          } else {
            console.error('Printer not connected');
            onFailure();
            return EMPTY;
          }
        })
      );
    } catch (err) {
      console.error(err);
      onFailure();
      return EMPTY;
    }
  }
}
