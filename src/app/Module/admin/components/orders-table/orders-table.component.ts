import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../Admin/admin.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-orders-table',
  templateUrl: './orders-table.component.html',
  styleUrl: './orders-table.component.scss'
})
export class OrdersTableComponent implements OnInit {
  orders: any[] = [];
  paginatedorder: any[] = [];
  currentPage = 1;
  pageSize = 10;
  startIndex = 0;
  totalPages!: number;
  Math = Math;
  isOrderModalVisible = false;
  selectedOrder: any = null;
  searchTerm: string = '';
  filteredOrders: any[] = [];
  filteredCount: number = 0;

  constructor(private adminService: AdminService) { }

  ngOnInit() {
    this.totalPages = Math.ceil(this.orders.length / this.pageSize);
    this.updatePaginatedOrders();
    this.calculateTotalPages();
    this.updatePaginatedOrders();
    this.fetchOrders();
  }

  fetchOrders() {
    this.adminService.getOrders().subscribe({
      next: (data) => {
        this.orders = data.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        this.filteredOrders = [...this.orders];
        this.filteredCount = this.filteredOrders.length;
        this.calculateTotalPages();
        this.updatePaginatedOrders();
        this.storeOrdersInLocalStorage(this.orders);
      },
      error: (error) => console.error('Error fetching orders:', error)
    });
  }

  filterOrdersById() {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredOrders = [...this.orders];
    } else {
      this.filteredOrders = this.orders.filter(order =>
        order.userName.toLowerCase().includes(term)
      );
    }
    this.currentPage = 1;
    this.filteredCount = this.filteredOrders.length;
    this.totalPages = Math.ceil(this.filteredOrders.length / this.pageSize);
    this.updatePaginatedOrders();
  }

  storeOrdersInLocalStorage(orders: any[]) {
    localStorage.setItem('orders', JSON.stringify(orders));
  }

  getOrdersFromLocalStorage() {
    const storedOrders = localStorage.getItem('orders');
    return storedOrders ? JSON.parse(storedOrders) : [];
  }

  getTotalPrice(items: any[]): number {
    return items.reduce((total, item) => total + item.quantity * item.disprice, 0);
  }

  updateStatus(index: number, newStatus: string) {
    this.orders[index].status = newStatus;
    this.storeOrdersInLocalStorage(this.orders);

    this.adminService.updateOrderStatus(this.orders[index].id, newStatus).subscribe({
      next: () => console.log('Order status updated successfully'),
      error: (error) => console.error('Error updating order status:', error),
    });
  }

  openOrderDetails(order: any) {
    this.selectedOrder = order;
    this.isOrderModalVisible = true;
  }

  handleCancel(): void {
    this.isOrderModalVisible = false;
    this.selectedOrder = null;
  }

  deleteOrder(index: number, id: string) {
    Swal.fire({
      title: "Are you sure?",
      text: "This order will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
      customClass: {
        popup: "bg-gray-900 text-white rounded-xl shadow-lg border border-gray-700",
        title: "text-yellow-400 text-xl font-semibold",
        confirmButton: "bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg",
        cancelButton: "bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg",
        htmlContainer: "text-gray-300 text-sm"
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.adminService.updateOrderStatus(id, "CANCELLED").subscribe({
          next: () => {
            this.orders[index].status = "CANCELLED";
            this.storeOrdersInLocalStorage(this.orders);
            this.calculateTotalPages();
            this.updatePaginatedOrders();

            Swal.fire({
              title: "Deleted!",
              text: "The order has been deleted.",
              icon: "success",
              confirmButtonText: "OK",
              customClass: {
                popup: "bg-gray-900 text-white rounded-xl shadow-lg border border-gray-700",
                confirmButton: "bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg"
              }
            });
          },
          error: (error) => {
            console.error('Error deleting order:', error);
            Swal.fire({
              title: "Error!",
              text: "Something went wrong while deleting the order.",
              icon: "error",
              confirmButtonText: "OK",
              customClass: {
                popup: "bg-gray-900 text-white rounded-xl shadow-lg border border-gray-700",
                confirmButton: "bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg"
              }
            });
          }
        });
      }
    });
  }

  onPageChange(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePaginatedOrders();
  }

  updatePaginatedOrders() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedorder = this.filteredOrders.slice(startIndex, endIndex);
  }

  calculateTotalPages() {
    this.totalPages = Math.ceil(this.orders.length / this.pageSize);
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

  getColorClass(color: string): string {
    const colorClasses: { [key: string]: string } = {
      'White': 'text-white border-gray-300 bg-gray-100 shadow text-gray-900',
      'Black': 'text-black border-gray-800 bg-gray-900 shadow-lg text-white',
      'Red': 'text-red-500 border-red-500 bg-red-100 shadow-red-500/50',
      'Purple': 'text-purple-500 border-purple-500 bg-purple-100 shadow-purple-500/50',
      'Brown': 'text-amber-700 border-amber-700 bg-amber-100 shadow-amber-700/50',
      'Pink': 'text-pink-500 border-pink-500 bg-pink-100 shadow-pink-500/50',
      'Green': 'text-green-500 border-green-500 bg-green-100 shadow-green-500/50',
      'Yellow': 'text-yellow-500 border-yellow-500 bg-yellow-100 shadow-yellow-500/50',
      'Blue': 'text-blue-500 border-blue-500 bg-blue-100 shadow-blue-500/50',
      'Grey': 'text-gray-500 border-gray-500 bg-gray-100 shadow-gray-500/50',
      'Orange': 'text-orange-500 border-orange-500 bg-orange-100 shadow-orange-500/50',
      'Gold': 'text-yellow-400 border-yellow-400 bg-yellow-100 shadow-yellow-400/50'
    };

    return colorClasses[color] || 'text-white border-gray-300 bg-gray-100 shadow';
  }
}
