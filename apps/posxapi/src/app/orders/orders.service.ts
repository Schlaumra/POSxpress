import { Injectable } from '@nestjs/common';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './schemas/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { Model } from 'mongoose';
import { AbstractCrudService } from '../../libs';
import { BillGroups, BillInfo, NotPaid } from '@px/interface';
import { PrintSchedulerService } from '../printers/print.scheduler.service';

@Injectable()
export class OrdersService extends AbstractCrudService<
  Order,
  CreateOrderDto,
  UpdateOrderDto
> {
  constructor(
    @InjectModel(Order.name) protected model: Model<Order>,
    private printScheduler: PrintSchedulerService
  ) {
    super();
  }

  async createOrUpdate(order: CreateOrderDto) {
    return this.model
      .findByIdAndUpdate(order._id, order, { upsert: true })
      .exec();
  }

  clear() {
    return this.model.deleteMany().exec();
  }

  async getOrderBill(): Promise<undefined> {
    const amount = await this.model.count();
    if (amount > 0) {
      const start = (await this.model.findOne().sort({ timeStarted: 1 }).exec())
        .timeStarted;
      const notPaid: NotPaid = {};
      const billGroup: BillGroups = {};
      let sum = 0;

      await this.model
        .find()
        .cursor()
        .eachAsync((doc) => {
          doc.productGroups.forEach((productGroup) => {
            if (productGroup.amount > 0) {
              const category = productGroup.product.tags[0];
              const product = {
                name: productGroup.product.name,
                info: productGroup.info,
              };
              const key = `${product.name}_${product.info}`;

              if (!billGroup[category]) {
                billGroup[category] = { products: new Map(), sum: 0 };
              }
              const oldGroup = billGroup[category].products.get(key);
              billGroup[category].products.set(key, {
                info: product.info,
                name: product.name,
                amount: productGroup.amount + (oldGroup?.amount || 0),
                price:
                  productGroup.product.price * productGroup.amount +
                  (oldGroup?.price || 0),
              });
              billGroup[category].sum +=
                productGroup.product.price * productGroup.amount;
              sum += productGroup.product.price * productGroup.amount;
            }
          });
          doc.payments?.bestellt.forEach((np) => {
            notPaid[doc.user] =
              (notPaid[doc.user] || 0) + np.amount * np.product.price;
            sum -= np.amount * np.product.price;
          });
          doc.payments?.teil.forEach((np) => {
            notPaid[doc.user] =
              (notPaid[doc.user] || 0) + np.amount * np.product.price;
            sum -= np.amount * np.product.price;
          });
          if (!doc.payments && !doc.payed) {
            doc.productGroups.forEach((np) => {
              notPaid[doc.user] =
                (notPaid[doc.user] || 0) + np.amount * np.product.price;
              sum -= np.amount * np.product.price;
            });
          }
        });

      (await this.printScheduler.printBill({
        start,
        end: new Date(),
        billGroup,
        notPaid,
        sum
      })).subscribe()
      // const resolvedBillGroup = {};
      // Object.entries(billGroup).forEach(([key, value]) => {
      //   resolvedBillGroup[key] = {
      //     products: Array.from(value.products.values()),
      //     sum: value.sum,
      //   };
      // });
      // return {
      //   start,
      //   end: new Date(),
      //   billGroup: resolvedBillGroup,
      //   notPaid,
      //   sum,
      // };
    }
  }

  async getFinalOrderBill() {
    const bill = await this.getOrderBill();
    await this.model.deleteMany().exec();
    return bill;
  }

  async getOrderStats(): Promise<BillInfo> {
    const amount = await this.model.count()
    if(amount > 0) {
      const stats = await this.model
        .aggregate<BillInfo>([
          {
            $facet: {
              totalDocuments: [{ $count: 'total' }],
              totalUnpayed: [{ $match: { payed: false } }, { $count: 'total' }],
              firstDocument: [{ $sort: { timeStarted: 1 } }, { $limit: 1 }],
              totalIncome: [
                { $group: { _id: null, income: { $sum: '$income' } } },
              ],
            },
          },
          {
            $project: {
              first: { $arrayElemAt: ['$firstDocument.timeStarted', 0] },
              amount: { $arrayElemAt: ['$totalDocuments.total', 0] },
              unpaid: { $arrayElemAt: ['$totalUnpayed.total', 0] },
              income: { $arrayElemAt: ['$totalIncome.income', 0] },
            },
          },
        ])
        .exec();
      return stats[0];
    }

    return {
      first: undefined,
      amount: undefined,
      unpaid: undefined,
      income: undefined,
    };
  }
}
