import { Injectable } from '@angular/core';
import { Order } from '@px/interface';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderStoreService {
  private ordersSubject = new BehaviorSubject<Order[]>([]);
  private orderArchiveSubject = new BehaviorSubject<Order[]>([]);
  private currentOrderSubject = new BehaviorSubject<Order | undefined>(
    undefined
  );

  public get orders$(): Observable<Order[]> {
    return this.ordersSubject.asObservable();
  }

  public get orderArchive$(): Observable<Order[]> {
    return this.orderArchiveSubject.asObservable();
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

  private getOrderArchiveFromLocalStore() {
    const lsItem = localStorage.getItem('order-archive');
    if (lsItem) {
      try {
        this.orderArchiveSubject.next(JSON.parse(lsItem) as Order[]);
      } catch {
        console.warn('The localstore contains wrong values: orderArchive');
      }
    }
  }

  private saveOrderArchiveToLocalStore() {
    localStorage.setItem(
      'order-archive',
      JSON.stringify(this.orderArchiveSubject.value)
    );
  }

  private addOrdertoArchive(order: Order) {
    if(order.payed == true) {
      this.orderArchiveSubject.next([...this.orderArchiveSubject.value, order])
    }
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

  public removeOrder(table: number): Order | null {
    const orders = this.ordersSubject.value;
    const orderIndex = orders.findIndex((ord) => ord.table === table);
    if (orderIndex >= 0) {
      const order = orders[orderIndex];
      orders.splice(orderIndex, 1);
      this.ordersSubject.next(orders.filter((ord) => ord.table !== table));
      if (this.currentOrderSubject.value?.table === table) {
        this.clearCurrentOrder();
      }
      return order;
    }
    return null;
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
      const order = this.removeOrder(table);
      if(order) this.addOrdertoArchive(order)
      this.clearCurrentOrder();
    } else console.warn('no current order; cannot remove');
  }

  constructor() {
    this.getOrdersFromLocalStore();
    this.getCurrentOrderFromLocalStore();
    this.getOrderArchiveFromLocalStore();

    this.ordersSubject.subscribe(() => this.saveOrdersToLocalStore());
    this.orderArchiveSubject.subscribe(() =>
      this.saveOrderArchiveToLocalStore()
    );
    this.currentOrderSubject.subscribe(() =>
      this.saveCurrentOrderToLocalStore()
    );
  }
}
