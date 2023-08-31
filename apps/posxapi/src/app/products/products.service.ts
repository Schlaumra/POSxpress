import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './schemas/product.shema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { AbstractCrudService } from '../../libs/';

@Injectable()
export class ProductsService extends AbstractCrudService<
  Product,
  CreateProductDto,
  UpdateProductDto
> {
  constructor(@InjectModel(Product.name) protected model: Model<Product>) {
    super();
  }

  public async updateSort(idArray: string[]) {
    const bulkOps = idArray.map((id, index) => ({
      updateOne: {
        filter: { _id: new Types.ObjectId(id) },
        update: { $set: { position: index } }
      }
    }));

    await this.model.bulkWrite(bulkOps);
  }
}
