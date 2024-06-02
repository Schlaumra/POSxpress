import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
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

  @Get('test')
  async testPrinter(@Query('ip') ip: string): Promise<boolean> {
    try {
      const response = await fetch(`http://${ip}`) // TODO: This is dangerous and allows to make arbitrary requests
      return response.ok
    }
    catch {
      return false
    }
  }

  @Post()
  create(@Body() createPrinterDto: CreatePrinterDto) {
    return this.printersService.create(createPrinterDto);
  }

  @Roles(['waiter'])
  @Post('print')
  print(@Body() order: Order) {
    return this.printersService.print(order);
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
