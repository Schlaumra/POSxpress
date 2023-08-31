import { Route } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { UserSettingsComponent } from './admin/user/user.settings.component';
import { PrinterSettingsComponent } from './admin/printer/printer.settings.component';
import { ProductSettingsComponent } from './admin/product/product.settings.component';
import { OrderComponent } from './order/order.component';
import { TableOrderComponent } from './order/table/table.order.component';
import { SelectOrderComponent } from './order/select/select.order.component';
import { PreviewOrderComponent } from './order/preview/preview.order.component';
import { PaymentOrderComponent } from './order/payment/payment.order.component';

export const appRoutes: Route[] = [
    { path: 'login', component: LoginComponent },
    { path: 'order', component: OrderComponent, children: [
        { path: 'table', component: TableOrderComponent },
        { path: 'select', component: SelectOrderComponent },
        { path: 'preview', component: PreviewOrderComponent },
        { path: 'payment', component: PaymentOrderComponent },
        { path: '**', redirectTo: 'table' },
    ] },
    { path: 'admin', component: AdminComponent, children: [
        { path: 'user', component: UserSettingsComponent },
        { path: 'printer', component: PrinterSettingsComponent },
        { path: 'product', component: ProductSettingsComponent },
    ] },
    // { path: '**', component: LoginComponent },
];
