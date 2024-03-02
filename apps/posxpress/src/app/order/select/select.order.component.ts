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
import { NgFor } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Order, ProductGroup } from '@px/interface';
import { ProductSettingsService } from '../../admin/product/product.settings.service';

@Component({
  selector: 'px-select.order',
  templateUrl: './select.order.component.html',
  styleUrls: ['./select.order.component.scss'],
})
export class SelectOrderComponent {
  tags: string[] = [];
  order: Order;

  constructor(
    protected orderStore: OrderService,
    private productSettingsService: ProductSettingsService,

    private data: DataService,
    public dialog: MatDialog
  ) {
    if (this.orderStore.order) {
      this.order = this.orderStore.order;
    } else throw Error('Keine Order');

    this.data.getSettings().subscribe((value) => (this.tags = value.tags));
    this.productSettingsService.index().subscribe((value) => {
      // TODO: this should not be the settings service
      if (this.order.productGroups.length === 0) {
        value.forEach((product) =>
          this.order.productGroups.push({
            id: uuidv4(),
            name: product.name,
            info: product.info,
            amount: 0,
            product: product,
          })
        );
      }
    });
  }

  addProduct(productGroup: ProductGroup) {
    productGroup.amount += 1;
  }

  removeProduct(productGroup: ProductGroup) {
    if (productGroup.amount > 0) {
      productGroup.amount -= 1;
    }
  }

  openProductOptions(productGroup: ProductGroup) {
    const dialogRef = this.dialog.open(ProductGroupDialogComponent, {
      data: { productGroup: productGroup },
    });

    dialogRef
      .afterClosed()
      .subscribe((result?: { action: string; productGroup: ProductGroup }) => {
        if (result?.action) {
          const groupIndex = this.order.productGroups.indexOf(productGroup);
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

          // const tmp1 = result.productGroup.amount
          switch (result.action) {
            case 'add':
              // result.productGroup.amount = productGroup.amount
              // if (JSON.stringify(result.productGroup) !== JSON.stringify(productGroup)) {
              // result.productGroup.amount = tmp1
              result.productGroup.id = uuidv4();
              if (result.productGroup.amount === productGroup.amount) {
                result.productGroup.amount = 1;
              }
              result.productGroup.custom = true;
              this.order.productGroups.splice(
                groupIndex + 1,
                0,
                result.productGroup
              );
              // }
              // else {
              // result.productGroup.amount = tmp1
              // this.order.productGroups[groupIndex] = result.productGroup
              // }
              break;
            case 'edit':
              this.order.productGroups[groupIndex] = result.productGroup;
              break;
          }
        }
      });
  }

  orderFilter = (value: ProductGroup) => value.amount > 0;
}

@Component({
  selector: 'px-select.edit.dialog',
  templateUrl: 'select.edit.dialog.html',
  standalone: true,
  imports: [
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
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
