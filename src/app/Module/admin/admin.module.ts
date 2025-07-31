import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './components/admin.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RouterModule } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';
import { AdminProductsComponent } from './components/admin-products/admin-products.component';
import { CreateProductComponent } from './components/create-product/create-product.component';
import { CustomersComponent } from './components/customers/customers.component';
import { OrdersTableComponent } from './components/orders-table/orders-table.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrandsComponent } from './components/brands/brands.component';
import { CategoryComponent } from './components/category/category.component';
import { SubcategoryComponent } from './components/subcategory/subcategory.component';
import { MenuComponent } from './components/menu/menu.component';
import { BrandTableComponent } from './components/brands/brand-table/brand-table.component';
import { MenuTableComponent } from './components/menu/menu-table/menu-table.component';
import { CategoryTableComponent } from './components/category/category-table/category-table.component';
import { SubcategoryTableComponent } from './components/subcategory/subcategory-table/subcategory-table.component';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';

@NgModule({
  declarations: [
    AdminComponent,
    DashboardComponent,
    AdminProductsComponent,
    CreateProductComponent,
    CustomersComponent,
    OrdersTableComponent,
    CategoryComponent,
    SubcategoryComponent,
    BrandsComponent,
    MenuComponent,
    BrandTableComponent,
    MenuTableComponent,
    CategoryTableComponent,
    SubcategoryTableComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AdminRoutingModule,
    MatDividerModule,
    NzDrawerModule,
    NzFormModule,
    NzSelectModule,
    NzInputModule,
    NzIconModule
  ]
})
export class AdminModule { }
