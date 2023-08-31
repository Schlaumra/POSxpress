import { ChangeDetectorRef, Component } from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';
import { BehaviorSubject } from 'rxjs';


interface link {
  name: string,
  link: string
}



@Component({
  selector: 'org-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'posxpress';
  links: BehaviorSubject<link[]> = new BehaviorSubject<link[]>([])
  links$ = this.links.asObservable()
  mobileQuery: MediaQueryList;

  fillerNav = Array.from({length: 50}, (_, i) => `Nav Item ${i + 1}`);

  private _mobileQueryListener: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  onRouterOutletActivate(event : any) {
    this.title = event.title || this.title
    this.links.next(event.links || [])
}

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
}
