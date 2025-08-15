import { Component, HostListener } from '@angular/core';
import { AdminService } from '../../../Admin/admin.service';
import Swal from 'sweetalert2';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-brand-table',
  templateUrl: './brand-table.component.html',
  styleUrl: './brand-table.component.scss'
})
export class BrandTableComponent {
  brands: any[] = [];
  paginatedBrands: any[] = [];
  menu: any[] = [];
  currentPage = 1;
  pageSize = 10;
  totalPages!: number;
  Math = Math;
  startIndex = 0;
  visible = false;
  selectedBrand: any = null;
  brandViewForm!: FormGroup;
  searchTerm: string = '';
  filteredBrands: any[] = [];
  filteredCount: number = 0;
  isMobile = window.innerWidth <= 768;

  constructor(private adminService: AdminService, private fb: FormBuilder, private route: Router) { }

  ngOnInit(): void {
    this.brandViewForm = this.fb.group({
      menu: [{ value: '', disabled: true }],
      name: [{ value: '', disabled: true }]
    });

    this.totalPages = Math.ceil(this.brands.length / this.pageSize);
    this.updatePaginatedBrands();
    this.getAllBrand();
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

  open(brands: any): void {
    this.selectedBrand = brands;

    this.brandViewForm.patchValue({
      menu: brands.menuId,
      name: brands.name
    });

    this.visible = true;
  }

  close(): void {
    this.visible = false;
  }

  getAllBrand() {
    this.adminService.getbrands('brands').subscribe(
      (data) => {
        this.brands = data.map((brands: any) => ({
          id: brands.id,
          menuId: brands.menuId,
          name: brands.name,
        }));
        this.filteredBrands = [...this.brands];
        this.filteredCount = this.filteredBrands.length;
        this.totalPages = Math.ceil(this.brands.length / this.pageSize);
        this.updatePaginatedBrands();
      },
      (error) => {
        console.error("Error fetching brands:", error);
      }
    );
  }

  filterBrands() {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredBrands = [...this.brands];
    } else {
      this.filteredBrands = this.brands.filter(brands =>
        brands.name.toLowerCase().includes(term)
      );
    }
    this.currentPage = 1;
    this.filteredCount = this.filteredBrands.length;
    this.totalPages = Math.ceil(this.filteredBrands.length / this.pageSize);
    this.updatePaginatedBrands();
  }

  editbrand(brand: any) {
    this.route.navigate(['/admin/create-brand', brand.id]);
  }

  deleteBrand(id: string) {
    Swal.fire({
      title: "Are you sure?",
      text: "This brand will be permanently deleted.",
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
        this.adminService.deleteBrand('brands', id).subscribe(
          () => {
            this.brands = this.brands.filter((brand) => brand.id !== id);

            this.totalPages = Math.ceil(this.brands.length / this.pageSize);

            if (this.paginatedBrands.length === 1 && this.currentPage > 1) {
              this.currentPage--;
            }

            this.updatePaginatedBrands();

            Swal.fire({
              title: "Brand Deleted! 🗑️",
              text: "The brand has been successfully removed.",
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
            console.error("Error deleting brand:", error);
          }
        );
      }
    });
  }

  onPageChange(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePaginatedBrands();
  }

  updatePaginatedBrands() {
    this.startIndex = (this.currentPage - 1) * this.pageSize; // Start index update karein
    const endIndex = this.startIndex + this.pageSize;
    this.paginatedBrands = this.filteredBrands.slice(this.startIndex, endIndex);
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
