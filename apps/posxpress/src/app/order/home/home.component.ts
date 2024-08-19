import { AsyncPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../auth/auth.service';
import { OrderService } from '../order.service';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { map, Observable } from 'rxjs';
import { Order } from '@px/interface';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { OrderDialogComponent } from './order.dialog';

@Component({
  selector: 'px-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.scss'],
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    NgFor,
    AsyncPipe,
    MatCardModule,
    NgIf,
    MatDividerModule,
    MatTableModule,
    DatePipe,
    MatDialogModule
  ],
})
export class HomeComponent {
  user: string;
  displayedColumns = ['table', 'payed_at'];
  orderArchiveSorted$: Observable<Order[]>;

  constructor(
    private authService: AuthService,
    protected orderService: OrderService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.user = this.authService.getUser();
    this.orderService.orderStore.clearCurrentOrder();
    this.orderArchiveSorted$ = this.orderService.orderArchive$.pipe(
      map((orders) =>
        orders.sort(
          (a, b) =>
            Date.parse(b.timePayed as unknown as string) -
            Date.parse(a.timePayed as unknown as string)
        )
      )
    );
  }

  openOrderDetails(order: Order) {
    this.dialog.open(OrderDialogComponent, {
      data: order,
    });
  }

  jumpToOrder(table: number) {
    this.orderService.jumpToOrder(table);
  }

  removeOrder(table: number) {
    this.orderService.orderStore.removeOrder(table);
  }

  logout() {
    this.router.navigate(['logout']);
  }
}
