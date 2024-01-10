import { PartialType } from '@nestjs/mapped-types';
import { Product } from '../schemas/product.shema';

export class UpdateProductDto extends PartialType(Product) {}
