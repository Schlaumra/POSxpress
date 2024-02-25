import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Order, IPrinter, Settings } from '@px/interface';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private httpClient: HttpClient) {}

  getPrinters(): Observable<IPrinter[]> {
    return this.httpClient.get<IPrinter[]>('/api/printers');
  }
  print(printer: IPrinter, order: Order) {
    return this.httpClient.post(`api/printers/print/${printer._id}`, order);
  }

  getSettings(): Observable<Settings> {
    return this.httpClient.get<Settings>('/api/settings');
  }
}
