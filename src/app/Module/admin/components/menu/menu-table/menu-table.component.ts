import { Component } from '@angular/core';
import { AdminService } from '../../../Admin/admin.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-table',
  templateUrl: './menu-table.component.html',
  styleUrl: './menu-table.component.scss'
})
export class MenuTableComponent {
  menus: any[] = [];
  paginatedMenus: any[] = [];
  currentPage = 1;
  pageSize = 10;
  totalPages!: number;

  constructor(private adminService: AdminService, private route: Router) { }

  ngOnInit(): void {
    this.getAllMenu();
  }

  getAllMenu() {
    this.adminService.getmenu('menu').subscribe(
      (data) => {
        this.menus = data.map((menu: any) => ({
          id: menu.id,
          name: menu.name,
        }));
        this.totalPages = Math.ceil(this.menus.length / this.pageSize);
        this.updatePaginatedMenus();
      },
      (error) => {
        console.error("Error fetching products:", error);
      }
    );
  }

  editMenu(menu: any) {
    this.route.navigate(['/admin/create-menu', menu.id]);
  }

  deleteMenu(id: string) {
    Swal.fire({
      title: "Are you sure?",
      text: "This menu will be permanently deleted.",
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
        this.adminService.deleteMenu('menu', id).subscribe(
          () => {
            this.menus = this.menus.filter((menu) => menu.id !== id);
            this.totalPages = Math.ceil(this.menus.length / this.pageSize);

            if (this.paginatedMenus.length === 1 && this.currentPage > 1) {
              this.currentPage--;
            }

            this.updatePaginatedMenus();

            Swal.fire({
              title: "Menu Deleted! 🗑️",
              text: "The menu has been successfully removed.",
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
            console.error("Error deleting menu:", error);
          }
        );
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
    this.paginatedMenus = this.menus.slice(startIndex, endIndex);
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
