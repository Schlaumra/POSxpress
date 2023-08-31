import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { UserSettingsComponent } from './admin/user/user.settings.component';
import { PrinterSettingsComponent } from './admin/printer/printer.settings.component';
import { ProductSettingsComponent } from './admin/product/product.settings.component';
import { OrderComponent } from './order/order.component';
import { TableOrderComponent } from './order/table/table.order.component';
import { PaymentOrderComponent } from './order/payment/payment.order.component';
import { SelectOrderComponent } from './order/select/select.order.component';
import { PreviewOrderComponent } from './order/preview/preview.order.component';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthService } from './auth/auth.service';
import { JwtModule } from '@auth0/angular-jwt';
import { PrintService } from './print/print.service';
import { AuthInterceptor } from './auth/auth-interceptor';
import { HomeComponent } from './order/home';
import { OrderStoreService } from './order.store.service';
import { LogoutComponent } from './logout/logout.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { DragDropModule } from '@angular/cdk/drag-drop';

export function tokenGetter() {
  return localStorage.getItem('access_token');
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AdminComponent,
    UserSettingsComponent,
    PrinterSettingsComponent,
    ProductSettingsComponent,
    OrderComponent,
    TableOrderComponent,
    SelectOrderComponent,
    PreviewOrderComponent,
    PaymentOrderComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
      },
    }),
    RouterModule.forRoot(appRoutes, { initialNavigation: 'enabledBlocking' }),
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    BrowserAnimationsModule,
    HomeComponent,
    ReactiveFormsModule,
    MatToolbarModule,
    MatBadgeModule,
    MatSidenavModule,
    MatTableModule,
    MatSnackBarModule,
    MatListModule,
    DragDropModule,
    MatExpansionModule,
    LogoutComponent,
    MatDialogModule,
    MatSelectModule,
    MatChipsModule,
    MatCardModule,
    MatCheckboxModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
  providers: [
    AuthService,
    PrintService,
    OrderStoreService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
