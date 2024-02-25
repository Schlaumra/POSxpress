import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateOrderDto } from './dto/create-order.dto';
import { orderEntityName } from '@px/interface';

@Controller(orderEntityName)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Roles(['waiter'])
  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Roles(['waiter'])
  @Get()
  findAll() {
    return this.ordersService.index();
  }

  @Roles(['waiter'])
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.show(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.delete(id);
  }
}
