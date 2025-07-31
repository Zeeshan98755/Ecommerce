import { Component, HostListener } from '@angular/core';
import { AdminService } from '../../../Admin/admin.service';
import Swal from 'sweetalert2';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-subcategory-table',
  templateUrl: './subcategory-table.component.html',
  styleUrl: './subcategory-table.component.scss'
})
export class SubcategoryTableComponent {
  subcategories: any[] = [];
  menu: any[] = [];
  categories: any[] = [];
  paginatedSubCategories: any[] = [];
  currentPage = 1;
  pageSize = 10;
  totalPages!: number;
  startIndex = 0;
  visible = false;
  selectedsubCategory: any = null;
  subcategoryViewForm!: FormGroup;
  searchTerm: string = '';
  filteredSubCategories: any[] = [];
  filteredCount: number = 0;
  isMobile = window.innerWidth <= 768;

  constructor(private adminService: AdminService, private fb: FormBuilder, private route: Router) { }

  ngOnInit(): void {
    this.subcategoryViewForm = this.fb.group({
      menu: [{ value: '', disabled: true }],
      category: [{ value: '', disabled: true }],
      name: [{ value: '', disabled: true }]
    });

    this.getAllmenu();
    this.getAllSubCategory();
    this.getCategoryOptions();
  }

  getAllmenu(): void {
    this.adminService.getmenu('menu').subscribe((data) => {
      this.menu = data;
    });
  }

  getCategoryOptions(): void {
    this.adminService.getCategories('categories').subscribe((data) => {
      this.categories = data;
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isMobile = event.target.innerWidth <= 768;
  }

  open(subcategory: any): void {
    this.selectedsubCategory = subcategory;

    this.subcategoryViewForm.patchValue({
      menu: subcategory.menuId,
      category: subcategory.categoryId,
      name: subcategory.name
    });

    this.visible = true;
  }

  close(): void {
    this.visible = false;
  }

  getAllSubCategory() {
    this.adminService.getsubCategories('subcategories').subscribe(
      (data) => {
        this.subcategories = data.map((subcategories: any) => ({
          menuId: subcategories.menuId,
          id: subcategories.id,
          categoryId: subcategories.categoryId,
          name: subcategories.name,
        }));
        this.filteredSubCategories = [...this.subcategories];
        this.filteredCount = this.filteredSubCategories.length;
        this.totalPages = Math.ceil(this.subcategories.length / this.pageSize);
        this.updatePaginatedSubCategories();
      },
      (error) => {
        console.error("Error fetching sub categories:", error);
      }
    );
  }

  filterSubCategories() {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredSubCategories = [...this.subcategories];
    } else {
      this.filteredSubCategories = this.subcategories.filter(subcategories =>
        subcategories.name.toLowerCase().includes(term)
      );
    }
    this.currentPage = 1;
    this.filteredCount = this.filteredSubCategories.length;
    this.totalPages = Math.ceil(this.filteredSubCategories.length / this.pageSize);
    this.updatePaginatedSubCategories();
  }

  editsubcategory(subcategory: any) {
    this.route.navigate(['/admin/create-sub_category', subcategory.id]);
  }

  deleteSubCategory(id: string) {
    Swal.fire({
      title: "Are you sure?",
      text: "This sub category will be permanently deleted.",
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
        this.adminService.deleteCategory('subcategories', id).subscribe(
          () => {
            this.subcategories = this.subcategories.filter((subcategory) => subcategory.id !== id);

            this.totalPages = Math.ceil(this.subcategories.length / this.pageSize);

            if (this.paginatedSubCategories.length === 1 && this.currentPage > 1) {
              this.currentPage--;
            }

            this.updatePaginatedSubCategories();

            Swal.fire({
              title: "Sub Category Deleted! 🗑️",
              text: "The sub category has been successfully removed.",
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
            console.error("Error deleting sub category:", error);
          }
        );
      }
    });
  }

  onPageChange(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePaginatedSubCategories();
  }

  updatePaginatedSubCategories() {
    this.startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = this.startIndex + this.pageSize;
    this.paginatedSubCategories = this.filteredSubCategories.slice(this.startIndex, endIndex);
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
