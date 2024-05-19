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
    this.dataService.getPrinters().subscribe((printers) => {
      this.dataService.print(printers[0], order).subscribe();
    });
  }

  testConnection(ip: string): Observable<boolean> {
    return this.dataService.testPrinter(ip)
  }
}
