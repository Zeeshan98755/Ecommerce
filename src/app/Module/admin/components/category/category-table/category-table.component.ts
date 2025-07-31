import { Component, HostListener } from '@angular/core';
import { AdminService } from '../../../Admin/admin.service';
import Swal from 'sweetalert2';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-category-table',
  templateUrl: './category-table.component.html',
  styleUrl: './category-table.component.scss'
})
export class CategoryTableComponent {
  categories: any[] = [];
  paginatedCategories: any[] = [];
  menu: any[] = [];
  visible = false;
  selectedCategory: any = null;
  categoryViewForm!: FormGroup;
  currentPage = 1;
  pageSize = 10;
  totalPages!: number;
  searchTerm: string = '';
  filteredCategories: any[] = [];
  filteredCount: number = 0;
  isMobile = window.innerWidth <= 768;

  constructor(private adminService: AdminService, private fb: FormBuilder, private route: Router) { }

  ngOnInit(): void {
    this.categoryViewForm = this.fb.group({
      menu: [{ value: '', disabled: true }],
      name: [{ value: '', disabled: true }]
    });

    this.getAllCategory();
    this.getMenuOptions();
  }

  getMenuOptions(): void {
    this.adminService.getmenu('menu').subscribe((data) => {
      this.menu = data;
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isMobile = event.target.innerWidth <= 768;
  }

  open(category: any): void {
    this.selectedCategory = category;

    this.categoryViewForm.patchValue({
      menu: category.menuId,
      name: category.name
    });

    this.visible = true;
  }

  close(): void {
    this.visible = false;
  }

  getAllCategory() {
    this.adminService.getCategories('categories').subscribe(
      (data) => {
        this.categories = data.map((categories: any) => ({
          id: categories.id,
          menuId: categories.menuId,
          name: categories.name,
        }));
        this.filteredCategories = [...this.categories];
        this.filteredCount = this.filteredCategories.length;
        this.totalPages = Math.ceil(this.categories.length / this.pageSize);
        this.updatePaginatedCategories();
      },
      (error) => {
        console.error("Error fetching products:", error);
      }
    );
  }

  filterCategories() {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredCategories = [...this.categories];
    } else {
      this.filteredCategories = this.categories.filter(category =>
        category.name.toLowerCase().includes(term)
      );
    }
    this.currentPage = 1;
    this.filteredCount = this.filteredCategories.length;
    this.totalPages = Math.ceil(this.filteredCategories.length / this.pageSize);
    this.updatePaginatedCategories();
  }

  editcategory(category: any) {
    this.route.navigate(['/admin/create-category', category.id]);
  }

  deleteCategory(id: string) {
    Swal.fire({
      title: "Are you sure?",
      text: "This category will be permanently deleted.",
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
        this.adminService.deleteCategory('categories', id).subscribe(
          () => {
            this.categories = this.categories.filter((category) => category.id !== id);

            this.totalPages = Math.ceil(this.categories.length / this.pageSize);

            if (this.paginatedCategories.length === 1 && this.currentPage > 1) {
              this.currentPage--;
            }

            this.updatePaginatedCategories();

            Swal.fire({
              title: "Category Deleted! 🗑️",
              text: "The category has been successfully removed.",
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
            console.error("Error deleting category:", error);
          }
        );
      }
    });
  }

  onPageChange(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePaginatedCategories();
  }

  updatePaginatedCategories() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedCategories = this.filteredCategories.slice(startIndex, endIndex);
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
