import { Component } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { Order } from '@px/interface';
import { DataService } from '../../data/data.service';
import { OrderService, OrderState } from '../order.service';

const MIN = 1;

@Component({
  selector: 'px-table.order',
  templateUrl: './table.order.component.html',
  styleUrls: ['./table.order.component.scss'],
})
export class TableOrderComponent {
  tableNumber = 0;
  formControl = this.formBuilder.control<number | null>(null, [Validators.required, Validators.min(MIN)])

  constructor(
    private orderStore: OrderService,
    private data: DataService,
    private formBuilder: NonNullableFormBuilder
  ) {
    this.data.getSettings().subscribe((value) => {
      this.tableNumber = value.tables;
      this.formControl.addValidators([
        Validators.max(this.tableNumber),
      ]);
    });
    this.formControl.valueChanges.subscribe((value) => {
      if (!!value && value >= MIN && value <= this.tableNumber) {
        if (value.toString().length === this.tableNumber.toString().length) {
          // TODO: Fix or remove table number 1000 -> 100 999
          this.goToSelection();
        }
      }
    });
  }

  goToSelection() {
    const tableNumber = this.formControl.value;
    if (!!tableNumber && tableNumber >= MIN && tableNumber <= this.tableNumber) {
      if(this.orderStore.orderStore.currentOrder?.table !== undefined) {
        const oldTable = this.orderStore.orderStore.currentOrder.table
        const newOrder: Order = {...this.orderStore.orderStore.currentOrder, table: tableNumber}
        this.orderStore.orderStore.updateCurrentOrder(newOrder, oldTable)
      }
      else {
        this.orderStore.creatOrder(tableNumber)
      }
      // TODO Check when order is already entered it deletes it
      this.orderStore.navigateToState(OrderState.select);
    }
  }
}
