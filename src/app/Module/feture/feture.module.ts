import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FetureComponent } from './Components/feture.component';
import { HomeComponent } from './Components/home/home.component';
import { MainCarouselComponent } from './Components/home/main-carousel/main-carousel.component';
import { ProductSliderComponent } from './Components/home/product-slider/product-slider.component';
import { HomeProductCartComponent } from './Components/home/home-product-cart/home-product-cart.component';
import { ProductsComponent } from './Components/products/products.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { SharedModule } from '../shared/shared.module';
import { ProductDetailsComponent } from './Components/product-details/product-details.component';
import { ProductReviewCardComponent } from './Components/product-details/product-review-card/product-review-card.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CheckoutComponent } from './Components/checkout/checkout.component';
import { AddressFormComponent } from './Components/checkout/address-form/address-form.component';
import { MatInputModule } from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { PaymentComponent } from './Components/payment/payment.component';
import { OrderComponent } from './Components/order/order.component';
import { CartComponent } from './Components/cart/cart.component';
import { OrderCardComponent } from './Components/order/order-card/order-card.component';
import { OrderDetailsComponent } from './Components/order-details/order-details.component';
import { RouterModule } from '@angular/router';
import { routes } from '../../app.routes';
import { WishlistComponent } from './Components/wishlist/wishlist.component';

@NgModule({
  declarations: [
    FetureComponent,
    HomeComponent,
    MainCarouselComponent,
    ProductSliderComponent,
    HomeProductCartComponent,
    ProductsComponent,
    ProductDetailsComponent,
    ProductReviewCardComponent,
    CheckoutComponent,
    AddressFormComponent,
    PaymentComponent,
    OrderComponent,
    CartComponent,
    OrderCardComponent,
    OrderDetailsComponent,
    WishlistComponent
  ],
  imports: [
    CommonModule,
    MatMenuModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    MatRadioModule,
    SharedModule,
    MatProgressBarModule,
    MatInputModule,
    MatFormFieldModule,
    NzFormModule,
    NzInputModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
    FetureComponent,
    HomeComponent,
    ProductsComponent,
    ProductDetailsComponent,
    ProductReviewCardComponent,
    CheckoutComponent,
    AddressFormComponent,
    PaymentComponent,
    OrderComponent,
    CartComponent,
    OrderCardComponent,
    OrderDetailsComponent,
    WishlistComponent,
    RouterModule
  ]
})
export class FetureModule { }
