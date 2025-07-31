import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../../../State/Cart/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent implements OnInit {
  cart: any[] = [];

  constructor(private route: Router, public cartService: CartService) { }

  ngOnInit() {
    this.cartService.cartItems$.subscribe((cart) => {
      this.cart = cart;
    });

    this.cartService.loadCart();
  }

  getTotalPrice(): number {
    return this.cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  getTotalDiscount(): number {
    return this.cart.reduce((total, item) => total + (item.price - item.disprice) * item.quantity, 0);
  }

  getFinalAmount(): number {
    return this.getTotalPrice() - this.getTotalDiscount();
  }

  navigateToCheckout() {
    this.route.navigate(['checkout']);
  }
}
