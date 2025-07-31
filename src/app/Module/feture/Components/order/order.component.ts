import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Order } from '../../../../Models/AppState';
import { OrderService } from '../../../../State/Order/order.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss'
})
export class OrderComponent {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  selectedFilters: string[] = [];
  paginatedOrders: any[] = [];
  isLoading: boolean = true;
  currentPage = 1;
  pageSize = 5;
  totalPages!: number;

  constructor(private orderService: OrderService, private router: Router) { }

  orderFilter = [
    { value: "PENDING", label: "Pending" },
    { value: "DELIVERED", label: "Delivered" },
    { value: "CANCELLED", label: "Cancelled" }
  ];

  ngOnInit(): void {
    this.orderService.orders$.subscribe((updatedOrders) => {
      this.orders = updatedOrders.map(order => ({
        ...order,
        items: order.items || [],
      }));
      this.applyFilters();
    });

    this.fetchOrderHistory();
  }

  fetchOrderHistory() {
    this.orderService.getOrderHistory().subscribe(
      (data: Order[]) => {
        this.orders = data.map(order => ({
          ...order,
          items: order.items || []
        }));
        this.applyFilters();
        if (this.orders.length > 0) {
          console.log("Total orders received:", this.orders.length);
        } else {
          console.warn("No orders returned from API.");
        }

        this.isLoading = false;
      },
      (error) => {
        console.error('Failed to fetch order history:', error);
        this.isLoading = false;
      }
    );
  }

  toggleFilter(status: string, isChecked: boolean) {
    if (isChecked) {
      this.selectedFilters.push(status);
    } else {
      this.selectedFilters = this.selectedFilters.filter(item => item !== status);
    }
    this.applyFilters();
  }

  applyFilters() {
    if (this.selectedFilters.length === 0) {
      this.filteredOrders = [...this.orders];
    } else {
      this.filteredOrders = this.orders.filter(order =>
        this.selectedFilters.includes(order.status)
      );
    }

    this.totalPages = Math.ceil(this.filteredOrders.length / this.pageSize) || 1;

    if (this.currentPage > this.totalPages) {
      this.currentPage = 1;
    }

    this.updatePaginatedMenus();
  }

  navigateToOrderDetails(orderId: string) {
    this.router.navigate([`order/${orderId}`]);
  }

  onPageChange(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePaginatedMenus();
  }

  updatePaginatedMenus() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedOrders = this.filteredOrders.slice(startIndex, endIndex);
  }

  getPageRange(): number[] {
    if (this.totalPages === 0) return [];

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
