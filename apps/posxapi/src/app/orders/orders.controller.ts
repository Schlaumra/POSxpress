import {
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';
import { orderEntityName } from '@px/interface';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersService } from './orders.service';

@Controller(orderEntityName)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Roles(['waiter'])
  @Post()
  createOrUpdate(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.createOrUpdate(createOrderDto);
  }

  @Post('clear')
  async clear() {
    await this.ordersService.clear()
  }

  @Get('bill/tmp')
  async printTmpBill() {
    return (await this.ordersService.getOrderBill())
  }

  @Get('bill')
  async printBill() {
    return (await this.ordersService.getFinalOrderBill())
  }
}
