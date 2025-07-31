import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { navigation } from './nav-content';
import { Router } from '@angular/router';
import { AdminService } from '../../../../admin/Admin/admin.service';

@Component({
  selector: 'app-nav-content',
  templateUrl: './nav-content.component.html',
  styleUrl: './nav-content.component.scss'
})
export class NavContentComponent implements OnInit {
  @Input() selectedSection!: string;

  categories: any[] = [];
  subcategories: { [key: string]: any[] } = {};
  brands: any[] = [];

  constructor(private adminService: AdminService, private route: Router) { }

  ngOnInit(): void {
    if (this.selectedSection) {
      this.fetchCategories(this.selectedSection);
      this.fetchBrands(this.selectedSection);
    }
  }

  fetchCategories(menuId: string) {
    this.adminService.getCategoriesByMenuId(menuId).subscribe((categories) => {
      this.categories = categories;
      categories.forEach((category: { id: string; }) => {
        this.fetchSubCategories(category.id);
      });
    });
  }

  fetchSubCategories(categoryId: string) {
    this.adminService.getSubCategoriesByCategoryId(categoryId).subscribe((subcategories) => {
      this.subcategories[categoryId] = subcategories;
    });
  }

  fetchBrands(menuId: string) {
    this.adminService.getBrandByMenuId(menuId).subscribe((brands) => {
      this.brands = brands.slice(0, 5);
    });
  }

  fetchProducts(subcategoryId?: string, brandId?: string) {
    const queryParams: any = {};

    if (subcategoryId) {
      queryParams.subcategoryId = subcategoryId;
    }

    if (brandId) {
      queryParams.brandId = brandId;
    }

    this.route.navigate(['/products'], { queryParams });
  }

  handleNavigate(path: any) {
    this.route.navigate([path]);
  }
}
