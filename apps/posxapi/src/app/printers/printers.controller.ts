import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PrintersService } from './printers.service';
import { CreatePrinterDto } from './dto/create-printer.dto';
import { UpdatePrinterDto } from './dto/update-printer.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Order } from '../orders/schemas/order.schema';
import { printerEntityName } from '@px/interface';

@Controller(printerEntityName)
export class PrintersController {
  constructor(private readonly printersService: PrintersService) {}

  @Post()
  create(@Body() createPrinterDto: CreatePrinterDto) {
    return this.printersService.create(createPrinterDto);
  }

  @Roles(['waiter'])
  @Post('print/:id')
  print(@Param('id') id: string, @Body() order: Order) {
    return this.printersService.print(id, order);
  }

  @Roles(['waiter'])
  @Get()
  findAll() {
    return this.printersService.index();
  }

  @Roles(['waiter'])
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.printersService.show(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePrinterDto: UpdatePrinterDto) {
    return this.printersService.update(id, updatePrinterDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.printersService.delete(id);
  }
}
