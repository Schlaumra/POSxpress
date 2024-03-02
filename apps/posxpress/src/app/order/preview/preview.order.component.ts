import { Component } from '@angular/core';
import { OrderService } from '../order.service';
import { DataService } from '../../data/data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PrintService } from '../../print/print.service';
import { Order, ProductGroup } from '@px/interface';

@Component({
  selector: 'px-preview.order',
  templateUrl: './preview.order.component.html',
  styleUrls: ['./preview.order.component.scss'],
})
export class PreviewOrderComponent {
  tags: string[] = [];
  order: Order;

  constructor(
    protected orderStore: OrderService,
    private data: DataService,
    private printService: PrintService,
    private snackBar: MatSnackBar
  ) {
    if (this.orderStore.order) {
      this.order = this.orderStore.order;
    } else throw Error('Keine Order');

    this.data.getSettings().subscribe((value) => (this.tags = value.tags));
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
    // const dialogRef = this.dialog.open(ProductGroupDialogComponent, {
    //   data: {productGroup: productGroup},
    // });
    // dialogRef.afterClosed().subscribe((result?: {action: string, productGroup: ProductGroup}) => {
    //   if(result?.action) {
    //     const groupIndex = this.order.productGroups.indexOf(productGroup)
    //     const customIngredients = result.productGroup.product.ingredients?.filter(value => value.changed)
    //     if(customIngredients && customIngredients.length > 0) {
    //       result.productGroup.info = ""
    //       customIngredients.forEach((value, i) => {
    //         if (i !== 0) {
    //           result.productGroup.info += ' '
    //         }
    //         result.productGroup.info += (value.contained ? '+' : '-') + value.name
    //       })
    //     }
    //     else if(customIngredients?.length === 0 && result.productGroup.product.note) {
    //       result.productGroup.info += ' ' + result.productGroup.product.note
    //     }
    //     // const tmp1 = result.productGroup.amount
    //     switch(result.action) {
    //       case 'add':
    //         // result.productGroup.amount = productGroup.amount
    //         // if (JSON.stringify(result.productGroup) !== JSON.stringify(productGroup)) {
    //           // result.productGroup.amount = tmp1
    //           result.productGroup.custom = true
    //           this.order.productGroups.splice(groupIndex+1, 0, result.productGroup)
    //         // }
    //         // else {
    //           // result.productGroup.amount = tmp1
    //           // this.order.productGroups[groupIndex] = result.productGroup
    //         // }
    //         break;
    //       case 'edit':
    //         this.order.productGroups[groupIndex] = result.productGroup
    //         break;
    //     }
    //   }
    //   console.log(result);
    // });
  }

  private _printOrder() {
    console.log('PRINTING', this.order);
    this.printService.print(this.order);
    this.order.printed = true;
    this.orderStore.navigateToState(this.orderStore.state + 1);
  }

  printOrder() {
    if (this.order.printed) {
      const snackBarRef = this.snackBar.open(
        'Order schon in der Warteschleife! Nochmal Drucken?',
        'Ja',
        { duration: 3000 }
      );
      snackBarRef.onAction().subscribe((_) => this._printOrder());
    } else {
      this._printOrder();
    }
  }
}
