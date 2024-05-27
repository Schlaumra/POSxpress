import { CurrencyPipe, NgFor } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Order, Payment, ProductGroup } from '@px/interface';
import { BehaviorSubject } from 'rxjs';
import { DataService } from '../../data/data.service';
import { OrderService } from '../order.service';

interface Categories {
  bestellt: ProductGroup[];
  teil: ProductGroup[];
  bezahlt: ProductGroup[];
}

@Component({
  selector: 'px-payment.order',
  templateUrl: './payment.order.component.html',
  styleUrls: ['./payment.order.component.scss'],
})
export class PaymentOrderComponent {
  private categoriesSubject = new BehaviorSubject<Categories>({
    bestellt: [],
    teil: [],
    bezahlt: [],
  });
  public categories$ = this.categoriesSubject.asObservable();

  constructor(
    protected orderStore: OrderService,
    private data: DataService,
    public dialog: MatDialog
  ) {
    this.orderStore.currentOrder$.subscribe(currentOrder => {
      if(currentOrder) {
        this.categoriesSubject.next({
          bestellt: currentOrder.productGroups.filter(
            OrderService.orderedFilter
          ),
          teil: [],
          bezahlt: [],
        })
      }
    }
    );
  }

  addFromTo(
    productGroup: ProductGroup,
    index: number,
    fromKey: keyof Categories,
    toKey: keyof Categories,
  ) {
    const categories = this.categoriesSubject.value
    const from = categories[fromKey]
    const to = categories[toKey]

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
    this.categoriesSubject.next(categories)
  }

  pay(paymentType: string, categoryKey: keyof Categories, order: Order) {
    const categories = this.categoriesSubject.value
    const productGroups = categories[categoryKey]

    const dialogRef = this.dialog.open(PayDialogComponent, {
      data: { paymentType: paymentType, productGroups: productGroups },
    });
    dialogRef.afterClosed().subscribe((result: Payment | undefined) => {
      if (!!result && result.payedWith > 0 && result.priceToPay > 0) {
        result.productGroups = [...productGroups];
        categories['bezahlt'].push(...productGroups);
        productGroups.splice(0, productGroups.length);
        order.payments.push(result);
        if (
          categories['bestellt'].length +
            categories['teil'].length ===
            0 &&
          order.payments.length > 0
        ) {
          order.payed = true;
        }

        // TODO: Remove all .orderStore calls
        this.orderStore.orderStore.updateCurrentOrder(order)
        this.categoriesSubject.next(categories)
      }
    });
  }

  addToPartPayment = (productGroup: ProductGroup, index: number) =>
    this.addFromTo(
      productGroup,
      index,
      'bestellt',
      'teil',
    );
  revertToOrdered = (productGroup: ProductGroup, index: number) =>
    this.addFromTo(
      productGroup,
      index,
      'teil',
      'bestellt'
    );

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
  priceToPay = 0;
  payedWith: number | null = null;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { paymentType: string; productGroups: ProductGroup[] }
  ) {
    this.priceToPay = this.data.productGroups.reduce(
      (prev, curr) => curr.product.price * curr.amount + prev,
      0
    );
  }
}
