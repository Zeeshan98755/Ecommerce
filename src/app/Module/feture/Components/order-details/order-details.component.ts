import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Order } from '../../../../Models/AppState';
import { OrderService } from '../../../../State/Order/order.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.scss'
})
export class OrderDetailsComponent implements OnInit, OnDestroy {
  orderId!: string;
  order!: Order;
  paginatedOrders: any[] = [];
  isLoading: boolean = true;
  currentPage = 1;
  pageSize = 5;
  totalPages!: number;
  Math = Math;
  errorMessage: string = '';
  pollingInterval: any;

  steps = [
    { id: 0, title: "PENDING", isCompleted: true },
    { id: 1, title: "CONFIRMED", isCompleted: true },
    { id: 2, title: "SHIPPED", isCompleted: false },
    { id: 3, title: "DELIVERED", isCompleted: false }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.orderId = params['id'];
      this.fetchOrderDetails(this.orderId);
    });

    this.pollingInterval = setInterval(() => {
      this.fetchOrderDetails(this.orderId);
    }, 5000);
  }

  ngOnDestroy(): void {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }
  }

  fetchOrderDetails(orderId: string) {
    this.orderService.getOrderById(orderId).subscribe(
      (data: Order) => {
        if (data.status === "CANCELLED") {
          Swal.fire({
            title: "Order Cancelled",
            text: "This order has been cancelled. You cannot view its details.",
            icon: "error",
            confirmButtonText: "Go Back",
            customClass: {
              popup: "bg-gray-900 text-white rounded-xl shadow-lg border border-gray-700",
              title: "text-red-400 text-xl font-semibold",
              confirmButton: "bg-[#69f0ae] hover:bg-[#69f0ae] text-black px-6 py-2 rounded-lg",
              htmlContainer: "text-gray-300 text-sm"
            }
          }).then(() => {
            this.router.navigate(['/account/orders']);
          });

          this.isLoading = false;
          return;
        }

        if (this.order?.status !== data.status) {
          this.order = data;
          this.updateOrderStatusSteps(this.order.status);

          this.totalPages = Math.ceil(this.order.items.length / this.pageSize) || 1;
          this.updatePaginatedMenus();
        }

        this.isLoading = false;
      },
      (error) => {
        this.errorMessage = 'Failed to fetch order details. Please try again later.';
        this.isLoading = false;
        console.error('Error fetching order details:', error);
      }
    );
  }

  updateOrderStatusSteps(status: string) {
    this.steps = this.steps.map(step => ({
      ...step,
      isCompleted: step.title === status || step.isCompleted
    }));
  }

  onPageChange(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePaginatedMenus();
  }

  updatePaginatedMenus() {
    if (!this.order || !this.order.items) {
      this.paginatedOrders = [];
      return;
    }

    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;

    this.paginatedOrders = this.order.items.slice(startIndex, endIndex);
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
