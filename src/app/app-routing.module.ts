import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CartComponent } from './Module/feture/Components/cart/cart.component';
import { CheckoutComponent } from './Module/feture/Components/checkout/checkout.component';
import { HomeComponent } from './Module/feture/Components/home/home.component';
import { OrderDetailsComponent } from './Module/feture/Components/order-details/order-details.component';
import { OrderComponent } from './Module/feture/Components/order/order.component';
import { PaymentSuccessComponent } from './Module/feture/Components/payment-success/payment-success.component';
import { PaymentComponent } from './Module/feture/Components/payment/payment.component';
import { ProductDetailsComponent } from './Module/feture/Components/product-details/product-details.component';
import { ProductsComponent } from './Module/feture/Components/products/products.component';
import { ProfileComponent } from './Module/shared/components/profile/profile.component';
import { AuthGuardService } from './State/Auth/auth-guard.service';
import { ContactComponent } from './Module/shared/components/contact/contact.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoaderInterceptor } from './interceptors/loader.interceptor';

const routes: Routes = [
  { path: 'admin', loadChildren: () => import('./Module/admin/admin.module').then(m => m.AdminModule), canActivate: [AuthGuardService] },
  { path: '', component: HomeComponent },
  { path: 'cart', component: CartComponent, canActivate: [AuthGuardService] },
  { path: 'product_details/:id', component: ProductDetailsComponent },
  { path: 'checkout', component: CheckoutComponent, canActivate: [AuthGuardService] },
  { path: 'checkout/payment/:id', component: PaymentComponent, canActivate: [AuthGuardService] },
  { path: 'payment-success', component: PaymentSuccessComponent, canActivate: [AuthGuardService] },
  { path: 'account/orders', component: OrderComponent, canActivate: [AuthGuardService] },
  { path: 'order/:id', component: OrderDetailsComponent, canActivate: [AuthGuardService] },
  { path: 'products', component: ProductsComponent },
  { path: 'products/:brandId', component: ProductsComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuardService] },
  { path: 'contact', component: ContactComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true }
  ]
})
export class AppRoutingModule { }
