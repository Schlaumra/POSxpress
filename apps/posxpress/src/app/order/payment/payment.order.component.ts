import { CurrencyPipe, NgFor } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Order, PaymentCategories, ProductGroup } from '@px/interface';
import { BehaviorSubject } from 'rxjs';
import { OrderService } from '../order.service';

export interface Payment {
  priceToPay: number;
  payedWith: number;
  productGroups?: ProductGroup[];
}

@Component({
  selector: 'px-payment.order',
  templateUrl: './payment.order.component.html',
  styleUrls: ['./payment.order.component.scss'],
})
export class PaymentOrderComponent {
  private categoriesSubject = new BehaviorSubject<PaymentCategories>({
    bestellt: [],
    teil: [],
    bezahlt: [],
  });
  public categories$ = this.categoriesSubject.asObservable();

  constructor(protected orderStore: OrderService, public dialog: MatDialog) {
    this.orderStore.currentOrder$.subscribe((currentOrder) => {
      if (currentOrder) {
        if(currentOrder.payments?.bezahlt.length || 0 > 0 && currentOrder.payments) {
          this.categoriesSubject.next(currentOrder.payments)
        } else {
          this.categoriesSubject.next({
            bestellt: JSON.parse(JSON.stringify(currentOrder)).productGroups.filter(
              OrderService.orderedFilter
            ),
            teil: [], 
            bezahlt: [],
          });
        }
      }
    });
  }

  addFromTo(
    productGroup: ProductGroup,
    index: number,
    fromKey: keyof PaymentCategories,
    toKey: keyof PaymentCategories
  ) {
    const categories = this.categoriesSubject.value;
    const from = categories[fromKey];
    const to = categories[toKey];

    let newProductGroup = to.find((value) => value.id === productGroup.id);

    if (!newProductGroup) {
      newProductGroup = JSON.parse(JSON.stringify(productGroup));
      if (newProductGroup) {
        newProductGroup.amount = 0;
        to.push(newProductGroup);
      }
    }

    if (newProductGroup) {
      if (productGroup.amount > 1) {
        productGroup.amount -= 1;
        newProductGroup.amount += 1;
      } else {
        from.splice(index, 1);
        newProductGroup.amount += 1;
      }
    }
    this.categoriesSubject.next(categories);
  }

  pay(paymentType: string, categoryKey: keyof PaymentCategories, order: Order) {
    const categories = this.categoriesSubject.value;
    const productGroups = categories[categoryKey];

    const dialogRef = this.dialog.open(PayDialogComponent, {
      data: { paymentType: paymentType, productGroups: productGroups },
      position: { top: '20px' },
    });
    dialogRef.afterClosed().subscribe((result: Payment | undefined) => {
      if (!!result && result.payedWith >= result.priceToPay) {
        order.income = !order.income ? result.priceToPay : order.income + result.priceToPay
        result.productGroups = [...productGroups];
        categories['bezahlt'].push(...productGroups);
        order.payments = categories
        productGroups.splice(0, productGroups.length);
        if (categories['bestellt'].length + categories['teil'].length === 0) {
          order.payed = true;
          order.timePayed = new Date();
        }

        // TODO: Remove all .orderStore calls
        this.orderStore.orderStore.updateCurrentOrder(order);
        this.orderStore.saveOrderToRemote()
        this.categoriesSubject.next(categories);
      }
    });
  }

  addToPartPayment = (productGroup: ProductGroup, index: number) =>
    this.addFromTo(productGroup, index, 'bestellt', 'teil');
  revertToOrdered = (productGroup: ProductGroup, index: number) =>
    this.addFromTo(productGroup, index, 'teil', 'bestellt');

  priceReducer(productGroups: ProductGroup[]) {
    return productGroups.reduce(
      (prev, curr) => curr.product.price * curr.amount + prev,
      0
    );
  }
}

@Component({
  selector: 'px-pay.dialog',
  templateUrl: 'pay.dialog.html',
  styleUrls: ['pay.dialog.scss'],
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
  priceForm = this.formBuilder.group({
    payedWith: this.formBuilder.control<number | null>(null),
  });
  priceToPay = 0;

  public get payedWith(): number | null {
    return this.priceForm.controls.payedWith.value;
  }

  constructor(
    public dialogRef: MatDialogRef<PayDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { paymentType: string; productGroups: ProductGroup[] },
    private formBuilder: FormBuilder
  ) {
    this.priceToPay = this.data.productGroups.reduce(
      (prev, curr) => curr.product.price * curr.amount + prev,
      0
    );
  }

  submit() {
    this.dialogRef.close({
      payedWith: this.payedWith,
      priceToPay: this.priceToPay,
    });
  }
}
