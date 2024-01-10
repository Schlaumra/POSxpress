import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OrderService, OrderState } from '../order.service';
import { DataService } from '../../data/data.service';
import { AuthService } from '../../auth/auth.service';

const MIN = 1;

@Component({
  selector: 'org-table.order',
  templateUrl: './table.order.component.html',
  styleUrls: ['./table.order.component.scss'],
})
export class TableOrderComponent {
  tableNumber = 0
  formControl = new FormControl<number | null>(null);

  constructor(
    private router: Router,
    private orderStore: OrderService,
    private data: DataService,
    private authService: AuthService
    ) {
    this.orderStore.state = OrderState.table
    this.data.getSettings().subscribe(value => {
      console.log(value)
      this.tableNumber = value.tables
      this.formControl.setValidators([Validators.required, Validators.max(this.tableNumber), Validators.min(MIN)])
    })
    this.formControl.valueChanges.subscribe((value) => {
      if (!!value && value >= MIN && value <= this.tableNumber) {
        if (value.toString().length === this.tableNumber.toString().length) { // TODO: Fix or remove table number 1000 -> 100 999
          this.goToSelection();
        }
      }
    })
  }
  
  goToSelection() {
    const value = this.formControl.value
    if (!!value && value >= MIN && value <= this.tableNumber) {
      this.orderStore.order = { table: value, user: this.authService.getUser(), productGroups: [], payed: false, printed: false, payments: [] }
      // TODO Check when order is already entered it deletes it
      this.orderStore.navigateToState(OrderState.select)
    }
  }
}
