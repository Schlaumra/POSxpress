import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../auth/auth.service';
import { OrderService } from '../order.service';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'px-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.scss'],
  standalone: true,
  imports: [MatButtonModule, MatIconModule, NgFor, AsyncPipe, MatCardModule, NgIf],
})
export class HomeComponent {
  user: string;

  constructor(private authService: AuthService, protected orderService: OrderService) {
    this.user = this.authService.getUser();
    this.orderService.orderStore.clearCurrentOrder()
  }

  jumpToOrder(table: number) {
    this.orderService.jumpToOrder(table)
  }

  removeOrder(table: number) {
    this.orderService.orderStore.removeOrder(table)
  }
}
