import { Injectable } from '@nestjs/common';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './schemas/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { Model } from 'mongoose';
import { AbstractCrudService } from '../../libs';

@Injectable()
export class OrdersService extends AbstractCrudService<Order, CreateOrderDto, UpdateOrderDto> {
  constructor(@InjectModel(Order.name) protected model: Model<Order>) {
    super()
  }
}
