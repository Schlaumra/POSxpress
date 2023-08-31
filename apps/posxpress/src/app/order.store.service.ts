import { Injectable } from '@angular/core';
import { Order } from '@px/interface';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderStoreService {
  private ordersSubject = new BehaviorSubject<Order[]>([]);
  private currentOrderSubject = new BehaviorSubject<Order | undefined>(
    undefined
  );

  public get orders$(): Observable<Order[]> {
    return this.ordersSubject.asObservable();
  }

  public get currentOrder$(): Observable<Order | undefined> {
    return this.currentOrderSubject.asObservable();
  }

  public get currentOrder(): Order | undefined {
    return this.currentOrderSubject.value;
  }

  private getOrdersFromLocalStore() {
    const lsItem = localStorage.getItem('orders');
    if (lsItem) {
      try {
        this.ordersSubject.next(JSON.parse(lsItem) as Order[]);
      } catch {
        console.warn('The localstore contains wrong values: orders');
      }
    }
  }

  private saveOrdersToLocalStore() {
    localStorage.setItem('orders', JSON.stringify(this.ordersSubject.value));
  }

  private getCurrentOrderFromLocalStore() {
    const lsItem = localStorage.getItem('currentOrder');
    console.log('currentOrder', lsItem);
    if (lsItem) {
      try {
        const currentOrderTable = Number.parseInt(lsItem);
        const currentOrder = this.getOrderByTable(currentOrderTable);
        if (currentOrder) {
          this.currentOrderSubject.next(currentOrder);
          console.log('successfully got currentorder');
        } else {
          console.warn('currentOrder is in localstore but not in array');
        }
      } catch {
        console.warn('The localstore contains wrong values: currentOrder');
      }
    }
  }

  private saveCurrentOrderToLocalStore() {
    const currentOrder = JSON.stringify(this.currentOrderSubject.value?.table);
    if (currentOrder) {
      localStorage.setItem('currentOrder', currentOrder);
    }
  }

  public setCurrentOrder(table: number) {
    const currentOrder = this.getOrderByTable(table);
    if (currentOrder) this.currentOrderSubject.next(currentOrder);
    else console.warn('Order not found');
  }

  public clearCurrentOrder() {
    this.currentOrderSubject.next(undefined);
  }

  public currentOrderIsSet(): boolean {
    return this.currentOrderSubject.value !== undefined;
  }

  public getOrderByTable(table: number): Order | undefined {
    return this.ordersSubject.value.find((order) => order.table == table);
  }

  public removeOrder(table: number) {
    const order = this.ordersSubject.value;
    this.ordersSubject.next(order.filter((ord) => ord.table !== table));
    if (this.currentOrderSubject.value?.table === table) {
      this.clearCurrentOrder();
    }
  }

  public addOrder(order: Order) {
    this.ordersSubject.next([...this.ordersSubject.value, order]);
    this.setCurrentOrder(order.table);
  }

  public updateCurrentOrder(order: Order, table: number = order.table) {
    const orders = this.ordersSubject.value;
    const oldOrder = orders.findIndex((ord) => ord.table === table);
    if (oldOrder !== -1) {
      orders[oldOrder] = order;
      this.ordersSubject.next(orders);
      this.setCurrentOrder(order.table);
    } else console.warn('cannot update order; not found');
  }

  public removeCurrentOrder() {
    const table = this.currentOrderSubject.value?.table;
    if (table) {
      this.removeOrder(table);
      this.clearCurrentOrder();
    } else console.warn('no current order; cannot remove');
  }

  constructor() {
    this.getOrdersFromLocalStore();
    this.getCurrentOrderFromLocalStore();

    this.ordersSubject.subscribe(() => this.saveOrdersToLocalStore());
    this.currentOrderSubject.subscribe(() =>
      this.saveCurrentOrderToLocalStore()
    );
  }
}
