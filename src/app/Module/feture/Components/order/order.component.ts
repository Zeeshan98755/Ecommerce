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
  Math = Math;
  totalProducts = 0;

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
        this.orders = data
          .map(order => ({ ...order, items: order.items || [] }))
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

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
        this.selectedFilters
          .map(s => s.toLowerCase())
          .includes(order.status.toLowerCase())
      );
    }

    const allProducts = this.filteredOrders.flatMap(order =>
      order.items.map(item => ({ order, item }))
    );

    this.totalProducts = allProducts.length;
    this.totalPages = Math.ceil(allProducts.length / this.pageSize) || 1;

    if (this.currentPage > this.totalPages) {
      this.currentPage = 1;
    }

    this.updatePaginatedMenus();
  }

  isStatusHighlighted(status: string): boolean {
    return this.selectedFilters.map(s => s.toLowerCase()).includes(status.toLowerCase());
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
    const allProducts = this.filteredOrders.flatMap(order =>
      order.items.map(item => ({ order, item }))
    );

    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;

    const paginatedProducts = allProducts.slice(startIndex, endIndex);

    // Group back by order while keeping full order object
    const grouped: { parentOrder: Order; items: any[] }[] = [];
    for (const { order, item } of paginatedProducts) {
      let group = grouped.find(g => g.parentOrder.id === order.id);
      if (!group) {
        group = { parentOrder: order, items: [] };
        grouped.push(group);
      }
      group.items.push(item);
    }

    this.paginatedOrders = grouped;
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