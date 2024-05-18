import { Component } from '@angular/core';
import { NonNullableFormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OrderService, OrderState } from '../order.service';
import { DataService } from '../../data/data.service';
import { AuthService } from '../../auth/auth.service';

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
    private authService: AuthService,
    private formBuilder: NonNullableFormBuilder
  ) {
    this.orderStore.state = OrderState.table;
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
    const value = this.formControl.value;
    if (!!value && value >= MIN && value <= this.tableNumber) {
      this.orderStore.order = {
        table: value,
        user: this.authService.getUser(),
        productGroups: [],
        payed: false,
        printed: false,
        payments: [],
      };
      // TODO Check when order is already entered it deletes it
      this.orderStore.navigateToState(OrderState.select);
    }
  }
}
