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
  paginatedcart: any[] = [];
  currentPage = 1;
  pageSize = 3;
  totalPages!: number;
  Math = Math;

  constructor(private route: Router, public cartService: CartService) { }

  ngOnInit() {
    this.cartService.cartItems$.subscribe((cart) => {
      this.cart = cart;
      this.totalPages = Math.ceil(this.cart.length / this.pageSize);

      if (this.currentPage > this.totalPages && this.totalPages > 0) {
        this.currentPage = this.totalPages;
      }
      if (this.totalPages === 0) {
        this.currentPage = 1;
      }

      this.updatePaginatedMenus();
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

  onPageChange(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePaginatedMenus();
  }

  updatePaginatedMenus() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedcart = this.cart.slice(startIndex, endIndex);
  }

  getPageRange(): number[] {
    const range = [];
    const maxPagesToShow = 5;
    const halfMaxPages = Math.floor(maxPagesToShow / 2);

    let startPage = this.currentPage - halfMaxPages;
    let endPage = this.currentPage + halfMaxPages;

    if (startPage < 1) {
      startPage = 1;
      endPage = maxPagesToShow;
    }

    if (endPage > this.totalPages) {
      endPage = this.totalPages;
      startPage = this.totalPages - maxPagesToShow + 1;
      if (startPage < 1) {
        startPage = 1;
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      range.push(i);
    }

    return range;
  }
}
