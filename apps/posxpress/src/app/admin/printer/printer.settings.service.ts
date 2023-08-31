import { Injectable } from '@angular/core';
import { AbstractCrudService } from '@px/client-crud';
import { HttpClient } from '@angular/common/http';
import {
  ICreatePrinter,
  IPrinter,
  IUpdatePrinter,
  printerEntityName,
} from '@px/interface';

@Injectable({
  providedIn: 'root',
})
export class PrinterSettingsService extends AbstractCrudService<
  IPrinter,
  ICreatePrinter,
  IUpdatePrinter
> {
  constructor(httpClient: HttpClient) {
    super(httpClient, printerEntityName);
  }
}
