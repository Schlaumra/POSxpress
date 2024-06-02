import { Injectable } from '@angular/core';
import { DataService } from '../data/data.service';
import { Order } from '@px/interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PrintService {
  constructor(private dataService: DataService) {}

  print(order: Order) {
    const filteredProductGroup = order.productGroups.filter(pg => pg.amount > 0)
    const newOrder: Order = {
      ...order,
      productGroups: filteredProductGroup
    }
    this.dataService.print(newOrder).subscribe();
  }

  testConnection(ip: string): Observable<boolean> {
    return this.dataService.testPrinter(ip)
  }
}
