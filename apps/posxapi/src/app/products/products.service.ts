import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './schemas/product.shema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { AbstractCrudService } from '../../libs/';

@Injectable()
export class ProductsService extends AbstractCrudService<Product, CreateProductDto, UpdateProductDto> {

  constructor(@InjectModel(Product.name) protected model: Model<Product>) {
    super()
  }
}
