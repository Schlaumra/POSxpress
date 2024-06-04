import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Order, ProductGroup } from '@px/interface';
import { BehaviorSubject, Observable, firstValueFrom, map } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { ProductSettingsService } from '../admin/product/product.settings.service';
import { v4 as uuidv4 } from 'uuid';
import { PrintService } from '../print/print.service';
import { OrderStoreService } from '../order.store.service';

export enum OrderState {
  'home',
  'table',
  'select',
  'print',
  'payment',
  'complete',
}

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  static tagFilter(tag: string) {
    return (value: ProductGroup) => value.product.tags.includes(tag);
  }

  static orderedFilter = (value: ProductGroup) => value.amount > 0;

  public currentPrice$: Observable<number | undefined>;

  public get orders$(): Observable<Order[]> {
    return this.orderStore.orders$
  }

  public get currentOrder$(): Observable<Order | undefined> {
    return this.orderStore.currentOrder$
  }

  public async creatOrder(table: number) {
    if (this.orderStore.getOrderByTable(table)) {
      console.warn('Removing already created order');
      this.orderStore.removeOrder(table);
    }
    const order: Order = {
      table,
      user: this.authService.getUser(),
      productGroups: await this.getProducts(),
      payed: false,
      printed: false,
      payments: [],
    };

    this.orderStore.addOrder(order);
  }

  public jumpToOrder(table: number) {
    this.orderStore.setCurrentOrder(table);
    this.navigateToCorrectState();
  }

  private getProducts(): Promise<ProductGroup[]> {
    return firstValueFrom(this.productSettingsService.index().pipe(
      map((value) => {
        const productGroups: ProductGroup[] = [];
        // TODO: this should not be the settings service
        value.forEach((product) =>
          productGroups.push({
            id: uuidv4(),
            name: product.name,
            info: product.info,
            amount: 0,
            product: product,
          })
        );
        return productGroups;
      })
    ));
  }

  public printOrder(table: number) {
    const order = this.orderStore.getOrderByTable(table)
    if(order) {
      order.printed = true
      this.orderStore.updateCurrentOrder(order)
      this.printService.print(order)
    } else console.warn(`can't print order; not found`, table)
  }

  private stateSubject = new BehaviorSubject(OrderState.home)
  public state$: Observable<number> = this.stateSubject.asObservable()

  constructor(
    public orderStore: OrderStoreService,
    private router: Router,
    private authService: AuthService,
    private productSettingsService: ProductSettingsService,
    private printService: PrintService,
  ) {
    this.orderStore.currentOrder$.subscribe(order => {
      if(!order) {
        this.navigateToState(OrderState.home)
      }
    })
    this.currentPrice$ = this.currentOrder$.pipe(
      map((currentOrder) => {
        if (currentOrder) {
          return (
            currentOrder.productGroups
              .filter(OrderService.orderedFilter)
              .reduce(
                (prev, curr) => curr.product.price * curr.amount + prev,
                0
              ) || 0
          );
        }
        return undefined;
      })
    );

    if(!this.orderStore.currentOrderIsSet()) this.navigateToState(OrderState.home)
      else this.navigateToCorrectState()
  }

  private _checkSelect(): boolean {
    return !!this.orderStore.currentOrder?.productGroups.filter(
      (productGroup) => productGroup.amount > 0
    ).length;
  }

  checkState(): OrderState {
    const currentOrder = this.orderStore.currentOrder;

    if (!currentOrder) return OrderState.home;
    else if (
      currentOrder.payed &&
      currentOrder.table &&
      currentOrder.payments.length > 0 &&
      this._checkSelect() &&
      currentOrder.printed
    )
      return OrderState.complete;
    else if (currentOrder.printed && currentOrder.table && this._checkSelect())
      return OrderState.payment;
    else if (currentOrder.table && this._checkSelect()) return OrderState.print;
    else if (currentOrder.table) return OrderState.select;
    return OrderState.home;
  }

  navigateToCorrectState() {
    this.navigateToState(this.checkState());
  }

  navigateToState(state: OrderState) {
    switch (state) {
      case OrderState.home:
        this.stateSubject.next(OrderState.home);
        this.router.navigate(['order', 'home']);
        break;
      case OrderState.table:
        this.stateSubject.next(OrderState.table);
        this.router.navigate(['order', 'table']);
        break;
      case OrderState.select:
        this.stateSubject.next(OrderState.select);
        this.router.navigate(['order', 'select']);
        break;
      case OrderState.print:
        this.stateSubject.next(OrderState.print);
        this.router.navigate(['order', 'preview']);
        break;
      case OrderState.payment:
        this.stateSubject.next(OrderState.payment);
        this.router.navigate(['order', 'payment']);
        break;
      case OrderState.complete:
        this.stateSubject.next(OrderState.home);
        // TODO Save order to archive
        this.orderStore.removeCurrentOrder();
        this.router.navigate(['order', 'home']);
        break;
      default:
        this.stateSubject.next(OrderState.home);
        this.router.navigate(['order', 'home']);
    }
  }

  public moveForward(amount = 1) {
    this.navigateToState(this.stateSubject.value + amount);
  }

  public moveBackward(amount = 1) {
    this.navigateToState(this.stateSubject.value - amount);
  }
}
