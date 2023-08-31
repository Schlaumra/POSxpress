import { PartialType } from '@nestjs/mapped-types';
import { Order } from '../schemas/order.schema';

export class UpdateOrderDto extends PartialType(Order) {}
