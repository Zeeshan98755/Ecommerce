import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../../../State/Cart/cart.service';
import { OrderService } from '../../../../State/Order/order.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss'
})
export class PaymentComponent {
  adresses: any[] = [];
  cart: any[] = [];
  paginatedcart: any[] = [];
  currentPage = 1;
  pageSize = 3;
  totalPages!: number;
  Math = Math;

  constructor(private route: Router, public cartService: CartService, private ordersrc: OrderService) { }

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

    this.getUserAddress();
    this.cartService.loadCart();
  }

  getUserAddress() {
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      const userData = JSON.parse(storedUser);
      if (userData && userData.address) {
        this.adresses = [{ address: userData.address, city: userData.city, zipCode: userData.zipCode, mobNumber: userData.mobNumber }];
      }
    } else {
      console.error('User not found in localStorage');
    }
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

  proceedToCheckout() {
    if (this.cart.length === 0) {
      Swal.fire({
        title: 'Error ❗',
        text: 'No product selected. Please select a product before proceeding.',
        icon: 'error',
        customClass: {
          popup: 'bg-gray-900 text-white rounded-xl shadow-lg border border-gray-700',
          title: 'text-red-400 text-xl font-semibold',
          confirmButton: 'bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg',
          htmlContainer: 'text-gray-300 text-sm',
        },
        confirmButtonText: 'OK',
      });
      return;
    }

    const userId = this.cartService.loginsrc.getUserId(); // Get user ID
    if (!userId) {
      console.error('User not logged in');
      return;
    }

    // Retrieve user address from localStorage
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      console.error('User data not found');
      return;
    }
    const userData = JSON.parse(storedUser);

    // Prepare the order data
    const orderData = {
      userId: userId,
      items: this.cart,
      totalAmount: this.getFinalAmount(),
      address: this.adresses[0], // Assuming first address is selected
      status: 'Pending', // Default status
      createdAt: new Date().toISOString()
    };

    // Create order and navigate
    this.ordersrc.createOrder(orderData).subscribe({
      next: (response) => {
        console.log('Order created successfully', response);
        this.cartService.clearCart(userId); // ✅ Clear cart after order is placed
        Swal.fire({
          title: 'Order Placed 🎉',
          text: 'Your order has been placed successfully. Thank you for shopping with us!',
          icon: 'success',
          customClass: {
            popup: 'bg-gray-900 text-white rounded-xl shadow-lg border border-gray-700',
            title: 'text-green-400 text-xl font-semibold',
            confirmButton: 'bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg',
            htmlContainer: 'text-gray-300 text-sm',
          },
          confirmButtonText: 'OK',
        });
      },
      error: (error) => {
        console.error('Failed to create order', error);
      }
    });
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
