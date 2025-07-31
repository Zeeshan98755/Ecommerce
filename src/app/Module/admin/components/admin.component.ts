import { Component } from '@angular/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {
  isSidebarCollapsed = false;

  navItems = [
    { label: 'Dashboard', link: '/admin' },
    { label: 'Mega Menu', link: '/admin/menu' },
    { label: 'Category', link: '/admin/category' },
    { label: 'Sub Category', link: '/admin/sub_category' },
    { label: 'Brands', link: '/admin/brand' },
    { label: 'Products', link: '/admin/product' },
    { label: 'Orders', link: '/admin/order' },
    { label: 'Customers', link: '/admin/customer' },
    { label: 'Add Mega Menu', link: '/admin/create-menu' },
    { label: 'Add Category', link: '/admin/create-category' },
    { label: 'Add Sub Category', link: '/admin/create-sub_category' },
    { label: 'Add Brands', link: '/admin/create-brand' },
    { label: 'Add Product', link: '/admin/create-product' }
  ];

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

}
