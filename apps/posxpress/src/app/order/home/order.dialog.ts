import { CurrencyPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { Order } from '@px/interface';

@Component({
    selector: 'px-order.dialog',
    templateUrl: 'order.dialog.html',
    styleUrls: ['order.dialog.scss'],
    imports: [MatDialogModule, MatButtonModule, DatePipe, CurrencyPipe, NgFor, NgIf]
})
export class OrderDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<OrderDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: Order
  ) {}

  close() {
    this.dialogRef.close();
  }
}
