import { Component, Inject } from '@angular/core';
import { DataService } from '../../data/data.service';
import { OrderService } from '../order.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { CurrencyPipe, NgFor } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { Order, Payment, ProductGroup } from '@px/interface';

@Component({
  selector: 'org-payment.order',
  templateUrl: './payment.order.component.html',
  styleUrls: ['./payment.order.component.scss'],
})
export class PaymentOrderComponent {
  categories: {[name: string]: ProductGroup[]} = {
    'bestellt': [],
    'teil': [],
    'bezahlt': [],
  }
  order: Order;

  constructor(
    protected orderStore: OrderService,
    private data: DataService,
    public dialog: MatDialog
  ) {
    if (this.orderStore.order) {
      this.order = this.orderStore.order;
      this.categories['bestellt'] = this.order.productGroups.filter(this.orderStore.orderedFilter)
    } else throw Error('Keine Order');
  }

  addFromTo(productGroup: ProductGroup, index: number, from: ProductGroup[], to: ProductGroup[]) {
    let newProductGroup = to.find(value => value.id === productGroup.id)

    if (!newProductGroup) {
      newProductGroup = JSON.parse(JSON.stringify(productGroup))
      if (newProductGroup) {
        newProductGroup.amount = 0
        to.push(newProductGroup)
      }
    }

    if(newProductGroup) {
      if (productGroup.amount > 1) {
        productGroup.amount -= 1
        newProductGroup.amount += 1
      }
      else {
        from.splice(index, 1)
        newProductGroup.amount += 1
      }
    }
  }

  pay(paymentType: string, productGroups: ProductGroup[]) {
    const dialogRef = this.dialog.open(PayDialogComponent, {
      data: {paymentType: paymentType, productGroups: productGroups},
    });

    dialogRef.afterClosed().subscribe((result: Payment | undefined) => {
      if (!!result && result.payedWith > 0 && result.priceToPay > 0) {
        result.productGroups = [...productGroups]
        this.categories['bezahlt'].push(...productGroups)
        productGroups.splice(0, productGroups.length)
        this.order.payments.push(result)

        if (this.categories['bestellt'].length + this.categories['teil'].length === 0 && this.order.payments.length > 0) {
          this.order.payed = true
        }
      }
    })
  }

  addToPartPayment = (productGroup: ProductGroup, index: number) => this.addFromTo(productGroup, index, this.categories['bestellt'], this.categories['teil'])
  revertToOrdered = (productGroup: ProductGroup, index: number) => this.addFromTo(productGroup, index, this.categories['teil'], this.categories['bestellt'])

  priceReducer(productGroups: ProductGroup[]) {
    return productGroups.reduce((prev, curr) => (curr.product.price * curr.amount)+prev, 0)
  }
}

@Component({
  selector: 'org-pay.dialog',
  templateUrl: 'pay.dialog.html',
  standalone: true,
  imports: [
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    MatFormFieldModule,
    MatDividerModule,
    MatIconModule,
    CurrencyPipe,
    NgFor,
    ReactiveFormsModule,
  ],
})
export class PayDialogComponent {
  priceToPay = 0
  payedWith: number | null = null

  constructor(@Inject(MAT_DIALOG_DATA) public data: { paymentType: string, productGroups: ProductGroup[] }) {
    this.priceToPay = this.data.productGroups.reduce((prev, curr) => (curr.product.price * curr.amount)+prev, 0)
  }
}