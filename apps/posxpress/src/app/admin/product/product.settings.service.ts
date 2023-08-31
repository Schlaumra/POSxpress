import { Injectable } from '@angular/core';
import { AbstractCrudService } from '@px/client-crud';
import { HttpClient } from '@angular/common/http';
import {
  ICreateProduct,
  IProduct,
  IUpdateProduct,
  productEntityName,
} from '@px/interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductSettingsService extends AbstractCrudService<
  IProduct,
  ICreateProduct,
  IUpdateProduct
> {
  constructor(httpClient: HttpClient) {
    super(httpClient, productEntityName);
  }

  public updateSorting(idArray: string[]): Observable<void> {
    return this.httpClient.post<void>(
      `${this.basePath}/${this.entityName}/sort`,
      { idArray }
    );
  }
}
