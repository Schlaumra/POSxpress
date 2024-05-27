import { Component } from '@angular/core';
import { OrderService } from '../order.service';
import { DataService } from '../../data/data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Order, ProductGroup } from '@px/interface';

@Component({
  selector: 'px-preview.order',
  templateUrl: './preview.order.component.html',
  styleUrls: ['./preview.order.component.scss'],
})
export class PreviewOrderComponent {
  tags: string[] = [];

  constructor(
    protected orderStore: OrderService,
    private data: DataService,
    private snackBar: MatSnackBar
  ) {
    this.data.getSettings().subscribe((value) => (this.tags = value.tags));
  }
  orderFilter = OrderService.orderedFilter;
  tagFilter = OrderService.tagFilter;

  saveOrder(order: Order) {
    this.orderStore.orderStore.updateCurrentOrder(order);
  }

  addProduct(productGroup: ProductGroup, order: Order) {
    const index = order.productGroups.findIndex(
      (pg) => pg.id === productGroup.id
    );
    if (index !== -1) {
      order.productGroups[index].amount += 1;
      this.saveOrder(order);
    } else
      console.warn('could not update productGroup; not found', productGroup);
  }

  removeProduct(productGroup: ProductGroup, order: Order) {
    const index = order.productGroups.findIndex(
      (pg) => pg.id === productGroup.id
    );
    if (index !== -1) {
      if (order.productGroups[index].amount > 0) {
        order.productGroups[index].amount -= 1;
        this.saveOrder(order);
      }
    } else
      console.warn('could not update productGroup; not found', productGroup);
  }

  private _printOrder(order: Order) {
    this.orderStore.printOrder(order.table);
    this.orderStore.moveForward()
  }

  printOrder(order: Order) {
    if (order.printed) {
      const snackBarRef = this.snackBar.open(
        'Order schon in der Warteschleife! Nochmal Drucken?',
        'Ja',
        { duration: 3000 }
      );
      snackBarRef.onAction().subscribe((_) => this._printOrder(order));
    } else {
      this._printOrder(order);
    }
  }
}
