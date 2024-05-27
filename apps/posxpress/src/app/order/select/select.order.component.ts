import { Component, Inject } from '@angular/core';
import { OrderService } from '../order.service';
import { DataService } from '../../data/data.service';
import { v4 as uuidv4 } from 'uuid';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { NgFor, NgIf } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Order, ProductGroup } from '@px/interface';
import { Observable } from 'rxjs';

@Component({
  selector: 'px-select.order',
  templateUrl: './select.order.component.html',
  styleUrls: ['./select.order.component.scss'],
})
export class SelectOrderComponent {
  protected tagFilter = OrderService.tagFilter;
  tags: string[] = [];
  order$: Observable<Order | undefined> = this.orderStore.currentOrder$;

  constructor(
    protected orderStore: OrderService,

    private data: DataService,
    public dialog: MatDialog
  ) {
    this.data.getSettings().subscribe((value) => (this.tags = value.tags));
  }

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

  openProductOptions(productGroup: ProductGroup, order: Order) {
    const dialogRef = this.dialog.open(ProductGroupDialogComponent, {
      data: { productGroup: productGroup },
    });

    dialogRef
      .afterClosed()
      .subscribe((result?: { action: string; productGroup: ProductGroup }) => {
        if (result?.action) {
          const groupIndex = order.productGroups.indexOf(productGroup);
          result.productGroup.info = result.productGroup.product.info;

          const customIngredients =
            result.productGroup.product.ingredients?.filter(
              (value) => value.changed
            );
          if (customIngredients && customIngredients.length > 0) {
            result.productGroup.info = result.productGroup.product.note
              ? result.productGroup.product.note + ' '
              : '';
            customIngredients.forEach((value, i) => {
              if (i !== 0) {
                result.productGroup.info += ' ';
              }
              result.productGroup.info +=
                (value.contained ? '+' : '-') + value.name;
            });
          } else if (
            (customIngredients?.length || 0) === 0 &&
            !!result.productGroup.product.note
          ) {
            result.productGroup.info = result.productGroup.product.note;
          }

          switch (result.action) {
            case 'add':
              result.productGroup.id = uuidv4();
              if (result.productGroup.amount === productGroup.amount) {
                result.productGroup.amount = 1;
              }
              result.productGroup.custom = true;
              order.productGroups.splice(groupIndex + 1, 0, result.productGroup);
              break;
            case 'edit':
              order.productGroups[groupIndex] = result.productGroup;
              break;
          }
          this.saveOrder(order);
        }
      });
  }

  orderFilter = OrderService.orderedFilter;
}

@Component({
  selector: 'px-select.edit.dialog',
  templateUrl: 'select.edit.dialog.html',
  styleUrls: ['select.edit.dialog.scss'],
  standalone: true,
  imports: [
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    NgIf,
    MatFormFieldModule,
    MatIconModule,
    MatCheckboxModule,
    NgFor,
    ReactiveFormsModule,
  ],
})
export class ProductGroupDialogComponent {
  productGroup: ProductGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { productGroup: ProductGroup }
  ) {
    this.productGroup = JSON.parse(JSON.stringify(this.data.productGroup));
    if (!this.productGroup.amount) this.productGroup.amount += 1;
  }

  checkIfSame(): boolean {
    const tmp1 = this.productGroup.amount;
    let result = false;
    this.productGroup.amount = this.data.productGroup.amount;
    if (
      JSON.stringify(this.productGroup) ===
      JSON.stringify(this.data.productGroup)
    ) {
      result = true;
    }
    this.productGroup.amount = tmp1;
    return result;
  }
}
