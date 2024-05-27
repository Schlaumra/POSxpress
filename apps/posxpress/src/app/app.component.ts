import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { OrderStoreService } from './order.store.service';

interface link {
  name: string;
  link: string;
}

@Component({
  selector: 'px-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'POSxpress';
  links: BehaviorSubject<link[]> = new BehaviorSubject<link[]>([]);
  links$ = this.links.asObservable();
  mobileQuery: MediaQueryList;
  closeOrder$: Observable<(() => void) | undefined>

  fillerNav = Array.from({ length: 50 }, (_, i) => `Nav Item ${i + 1}`);

  private _mobileQueryListener: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private orderStore: OrderStoreService, private router: Router) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

    this.closeOrder$ = this.orderStore.currentOrder$.pipe(
      map(order => {
        if (order?.table) {
          return () => {
            this.orderStore.clearCurrentOrder()
            router.navigate(['order'])
          }
        }
        return undefined
      })
    )
  }

  onRouterOutletActivate(event: any) {
    this.title = event.title || this.title;
    this.links.next(event.links || []);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
}
