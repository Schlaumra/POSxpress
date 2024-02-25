import { Injectable } from '@angular/core';
import { AbstractCrudService } from '../../../libs/crud';
import { HttpClient } from '@angular/common/http';
import { ICreateProduct, IProduct, IUpdateProduct, productEntityName } from '@px/interface';

@Injectable({
  providedIn: 'root',
})
export class ProductSettingsService extends AbstractCrudService<IProduct, ICreateProduct, IUpdateProduct> {
  constructor(httpClient: HttpClient) {
    super(httpClient, productEntityName)
  }
}
