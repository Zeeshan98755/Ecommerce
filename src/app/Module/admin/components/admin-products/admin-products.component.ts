import { Component, HostListener, OnInit } from '@angular/core';
import { Product } from '../../../../Models/AppState';
import { AdminService } from '../../Admin/admin.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrl: './admin-products.component.scss'
})
export class AdminProductsComponent implements OnInit {
  products: Product[] = [];
  paginatedProducts: Product[] = [];
  menu: any[] = [];
  categories: any[] = [];
  subcategories: any[] = [];
  brands: any[] = [];
  currentPage = 1;
  pageSize = 10;
  totalPages!: number;
  startIndex = 0;
  visible = false;
  selectedProduct: any = null;
  ProductViewForm!: FormGroup;
  searchTerm: string = '';
  filteredProducts: any[] = [];
  filteredCount: number = 0;
  isMobile = window.innerWidth <= 768;

  constructor(private adminService: AdminService, private fb: FormBuilder, private route: Router) { }

  ngOnInit(): void {
    this.ProductViewForm = this.fb.group({
      menu: [{ value: '', disabled: true }],
      category: [{ value: '', disabled: true }],
      subcategory: [{ value: '', disabled: true }],
      brand: [{ value: '', disabled: true }],
      image: [{ value: '', disabled: true }],
      title: [{ value: '', disabled: true }],
      color: [{ value: '', disabled: true }],
      details: [{ value: '', disabled: true }],
      price: [{ value: '', disabled: true }],
      disprice: [{ value: '', disabled: true }],
      dispercent: [{ value: '', disabled: true }],
    });

    this.getAllproduct();
    this.getAllmenu();
    this.getAllcategory();
    this.getAllsubcategory();
    this.getAllbrand();
  }

  getAllmenu(): void {
    this.adminService.getmenu('menu').subscribe((data) => {
      this.menu = data;
    });
  }

  getAllcategory(): void {
    this.adminService.getCategories('categories').subscribe((data) => {
      this.categories = data;
    });
  }

  getAllsubcategory(): void {
    this.adminService.getsubCategories('subcategories').subscribe((data) => {
      this.subcategories = data;
    });
  }

  getAllbrand(): void {
    this.adminService.getbrands('brands').subscribe((data) => {
      this.brands = data;
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isMobile = event.target.innerWidth <= 768;
  }

  open(product: any): void {
    this.selectedProduct = product;

    this.ProductViewForm.patchValue({
      menu: product.menuId,
      category: product.categoryId,
      subcategory: product.subcategoryId,
      brand: product.brandId,
      image: product.image,
      title: product.title,
      color: product.color,
      details: product.details,
      price: product.price,
      disprice: product.disprice,
      dispercent: product.dispercent,
    });

    this.visible = true;
  }

  close(): void {
    this.visible = false;
  }

  getAllproduct() {
    this.adminService.allProduct('products').subscribe(
      (data) => {
        this.products = data.map((product: any) => ({
          id: product.id,
          menuId: product.menuId,
          categoryId: product.categoryId,
          subcategoryId: product.subcategoryId,
          brandId: product.brandId,
          image: product.image,
          title: product.title,
          color: product.color,
          details: product.details,
          price: product.price,
          disprice: product.disprice,
          dispercent: product.dispercent,
        }));
        this.filteredProducts = [...this.products];
        this.filteredCount = this.filteredProducts.length;
        this.totalPages = Math.ceil(this.products.length / this.pageSize);
        this.updatePaginatedProducts();
      },
      (error) => {
        console.error("Error fetching products:", error);
      }
    );
  }

  filterProducts() {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredProducts = [...this.products];
    } else {
      this.filteredProducts = this.products.filter(products =>
        products.title.toLowerCase().includes(term)
      );
    }
    this.currentPage = 1;
    this.filteredCount = this.filteredProducts.length;
    this.totalPages = Math.ceil(this.filteredProducts.length / this.pageSize);
    this.updatePaginatedProducts();
  }

  editproduct(product: any) {
    this.route.navigate(['/admin/create-product', product.id]);
  }

  deleteproduct(id: string) {
    Swal.fire({
      title: "Are you sure?",
      text: "This product will be permanently deleted.",
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
        this.adminService.deleteProduct('products', id).subscribe(
          () => {
            this.products = this.products.filter((product) => product.id !== id);

            this.totalPages = Math.ceil(this.products.length / this.pageSize);

            if (this.paginatedProducts.length === 1 && this.currentPage > 1) {
              this.currentPage--;
            }

            this.updatePaginatedProducts();

            Swal.fire({
              title: "Product Deleted! 🗑️",
              text: "The product has been successfully removed.",
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
            console.error("Error deleting product:", error);
          }
        );
      }
    });
  }

  onPageChange(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePaginatedProducts();
  }

  updatePaginatedProducts() {
    this.startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = this.startIndex + this.pageSize;
    this.paginatedProducts = this.filteredProducts.slice(this.startIndex, endIndex);
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
