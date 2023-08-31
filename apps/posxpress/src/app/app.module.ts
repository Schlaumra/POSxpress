import { NgModule } from '@angular/core';
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
import {MatExpansionModule} from '@angular/material/expansion';
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
import {MatBadgeModule} from '@angular/material/badge';
import { MatSnackBarModule } from '@angular/material/snack-bar';

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
    RouterModule.forRoot(appRoutes, { initialNavigation: 'enabledBlocking' }),
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatBadgeModule,
    MatSidenavModule,
    MatTableModule,
    MatSnackBarModule,
    MatListModule,
    MatExpansionModule,
    MatDialogModule,
    MatSelectModule,
    MatChipsModule,
    MatCardModule,
    MatCheckboxModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
