import { Component } from '@angular/core';
import { OrderService, OrderState } from './order.service';

@Component({
  selector: 'px-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})
export class OrderComponent {
  paymentState = OrderState.payment;
  selectState = OrderState.select;
  constructor(public orderStore: OrderService) {}

  navigateBack() {
    this.orderStore.moveBackward()
  }

  navigateforward() {
    this.orderStore.moveForward()
  }

  startNewOrder() {
    this.orderStore.navigateToState(OrderState.table)
  }
}
