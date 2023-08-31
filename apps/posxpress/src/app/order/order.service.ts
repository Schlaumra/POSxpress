import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Order, ProductGroup } from 'libs/interface';

export enum OrderState {
  "table",
  "select",
  "print",
  "payment",
  "complete"
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  order: Order | null = null
  state: OrderState = OrderState.table

  constructor(private router: Router) {
    if (this.checkState() < OrderState.select) {
      this.navigateToCorrectState();
    }
  }

  private _checkSelect(): boolean {
    return !!(this.order?.productGroups.filter(value => value.amount > 0).length)
  }

  checkState(): OrderState {
    if (!this.order) return OrderState.table
    else if (this.order.payed && this.order.table && this.order.payments.length > 0 && this._checkSelect() && this.order.printed) return OrderState.complete
    else if (this.order.printed && this.order.table && this._checkSelect()) return OrderState.payment
    else if (this.order.table && this._checkSelect()) return OrderState.print
    else if (this.order.table) return OrderState.select
    return OrderState.table
  }

  navigateToCorrectState() {
    this.navigateToState(this.checkState())
  }

  navigateToState(state: OrderState) {
    switch(state) {
        case OrderState.table:
        this.state = OrderState.table
        this.router.navigate(['order', 'table'])
        break;
      case OrderState.select:
        this.state = OrderState.select
        this.router.navigate(['order', 'select'])
        break;
      case OrderState.print:
        this.state = OrderState.print
        this.router.navigate(['order', 'preview'])
        break;
      case OrderState.payment:
        this.state = OrderState.payment
        this.router.navigate(['order', 'payment'])
        break;
      case OrderState.complete:
        this.state = OrderState.table
        // TODO Save order to archive
        this.order = null
        this.router.navigate(['order', 'table'])
        break;
      default:
        this.state = OrderState.table
        this.router.navigate(['order', 'table'])
    }
  }

  tagFilter(tag: string) {
    return (value: ProductGroup) => value.product.tags.includes(tag);
  }

  orderedFilter = (value: ProductGroup) => value.amount > 0
}
