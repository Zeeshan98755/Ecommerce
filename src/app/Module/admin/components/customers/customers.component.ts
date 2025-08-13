import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../Admin/admin.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss'
})
export class CustomersComponent implements OnInit {
  customers: any[] = [];
  paginatedCustomers: any[] = [];
  currentPage = 1;
  pageSize = 10;
  totalPages!: number;
  startIndex = 0;
  searchTerm: string = '';
  filteredCustomers: any[] = [];
  filteredCount: number = 0;

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.getAllUser();
  }

  getAllUser() {
    this.adminService.allUser('user').subscribe(
      (data) => {
        this.customers = data.map((user: any) => ({
          id: user.id,
          initial: user.firstName.charAt(0).toUpperCase(),
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          image: user.image || null,
          avatarColor: this.getRandomColor(),
        }));
        this.filteredCustomers = [...this.customers];
        this.filteredCount = this.filteredCustomers.length;
        this.totalPages = Math.ceil(this.customers.length / this.pageSize);
        this.updatePaginatedCustomers();
      },
      (error) => {
        console.error("Error fetching users:", error);
      }
    );
  }

  filterCustomers() {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredCustomers = [...this.customers];
    } else {
      this.filteredCustomers = this.customers.filter(customer =>
        customer.firstName.toLowerCase().includes(term)
      );
    }
    this.currentPage = 1;
    this.filteredCount = this.filteredCustomers.length;
    this.totalPages = Math.ceil(this.filteredCustomers.length / this.pageSize);
    this.updatePaginatedCustomers();
  }

  deleteUser(id: number) {
    Swal.fire({
      title: "Are you sure?",
      text: "This user will be permanently deleted.",
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
        this.adminService.deleteUser('user', id).subscribe(
          () => {
            this.customers = this.customers.filter((user) => user.id !== id);

            this.totalPages = Math.ceil(this.customers.length / this.pageSize);

            if (this.paginatedCustomers.length === 1 && this.currentPage > 1) {
              this.currentPage--;
            }

            this.updatePaginatedCustomers();

            Swal.fire({
              title: "User Deleted! 🗑️",
              text: "The user has been successfully removed.",
              icon: "success",
              customClass: {
                popup: "bg-gray-900 text-white rounded-xl shadow-lg border border-gray-700",
                title: "text-green-400 text-xl font-semibold",
                confirmButton: "bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg",
                htmlContainer: "text-gray-300 text-sm"
              },
              showConfirmButton: true,
              confirmButtonText: "OK",
              allowOutsideClick: false,
            });
          },
          (error) => {
            console.error("Error deleting user:", error);
          }
        );
      }
    });
  }

  getRandomColor(): string {
    const colors = ['bg-orange-500', 'bg-purple-600', 'bg-blue-500', 'bg-green-500'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  onPageChange(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePaginatedCustomers();
  }

  updatePaginatedCustomers() {
    this.startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = this.startIndex + this.pageSize;
    this.paginatedCustomers = this.filteredCustomers.slice(this.startIndex, endIndex);
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
