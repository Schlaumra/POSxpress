import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../auth/auth.service';
import { OrderService } from '../order.service';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'px-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.scss'],
  standalone: true,
  imports: [MatButtonModule, MatIconModule, NgFor, AsyncPipe, MatCardModule, NgIf, MatDividerModule],
})
export class HomeComponent {
  user: string;

  constructor(private authService: AuthService, protected orderService: OrderService, private router: Router) {
    this.user = this.authService.getUser();
    this.orderService.orderStore.clearCurrentOrder()
  }

  jumpToOrder(table: number) {
    this.orderService.jumpToOrder(table)
  }

  removeOrder(table: number) {
    this.orderService.orderStore.removeOrder(table)
  }

  logout() {
    this.router.navigate(['logout'])
  }
}
