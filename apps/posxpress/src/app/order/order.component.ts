import { Component } from '@angular/core';
import { OrderService, OrderState } from './order.service';

@Component({
  selector: 'org-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})
export class OrderComponent {
  paymentState = OrderState.payment
  selectState = OrderState.select
  constructor(public orderStore: OrderService) {}

  navigateBack() {
    this.orderStore.navigateToState(this.orderStore.state-1)
  }

  navigateforward() {
    this.orderStore.navigateToState(this.orderStore.state+1)
  }
}
