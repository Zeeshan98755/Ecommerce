import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NavContentComponent } from './components/navbar/nav-content/nav-content.component';
import { MatMenuModule } from '@angular/material/menu';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { StarRatingComponent } from './components/star-rating/star-rating.component';
import { CartItemComponent } from './components/cart-item/cart-item.component';
import { AddressCardComponent } from './components/address-card/address-card.component';
import { OrderTrackerComponent } from './components/order-tracker/order-tracker.component';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { AuthModule } from "../auth/auth.module";
import { ProfileComponent } from './components/profile/profile.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { ContactComponent } from './components/contact/contact.component';
import { IntlTelInputDirective } from '../../directives/intl-tel-input.directive';
import { NgZorroAntdModule } from './ng-zorro-antd.module';

@NgModule({
  declarations: [
    NavbarComponent,
    FooterComponent,
    NavContentComponent,
    ProductCardComponent,
    StarRatingComponent,
    CartItemComponent,
    AddressCardComponent,
    OrderTrackerComponent,
    ProfileComponent,
    ContactComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatDividerModule,
    MatDialogModule,
    RouterModule,
    ReactiveFormsModule,
    AuthModule,
    NzMessageModule,
    NzFormModule,
    NzInputModule,
    IntlTelInputDirective,
    NgZorroAntdModule
  ],
  exports: [
    NavbarComponent,
    FooterComponent,
    ProductCardComponent,
    StarRatingComponent,
    CartItemComponent,
    AddressCardComponent,
    OrderTrackerComponent,
    ProfileComponent,
    ContactComponent
  ]
})
export class SharedModule { }
