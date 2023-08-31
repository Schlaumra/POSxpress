import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { UpdateProductDto } from './dto/update-product.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateProductDto } from './dto/create-product.dto';
import { productEntityName } from '@px/interface';

@Controller(productEntityName)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Post('sort')
  updateSort(@Body() idArrayDto: {idArray: string[]}) {
    return this.productsService.updateSort(idArrayDto.idArray);
  }

  @Roles(['waiter'])
  @Get()
  findAll() {
    return this.productsService.index();
  }

  @Roles(['waiter'])
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.show(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.delete(id);
  }
}
