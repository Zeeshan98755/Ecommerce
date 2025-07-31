import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './components/admin.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AdminProductsComponent } from './components/admin-products/admin-products.component';
import { OrdersTableComponent } from './components/orders-table/orders-table.component';
import { CustomersComponent } from './components/customers/customers.component';
import { CreateProductComponent } from './components/create-product/create-product.component';
import { CategoryComponent } from './components/category/category.component';
import { SubcategoryComponent } from './components/subcategory/subcategory.component';
import { BrandsComponent } from './components/brands/brands.component';
import { MenuComponent } from './components/menu/menu.component';
import { MenuTableComponent } from './components/menu/menu-table/menu-table.component';
import { CategoryTableComponent } from './components/category/category-table/category-table.component';
import { SubcategoryTableComponent } from './components/subcategory/subcategory-table/subcategory-table.component';
import { BrandTableComponent } from './components/brands/brand-table/brand-table.component';

const routes: Routes = [
  {
    path: '', component: AdminComponent, children: [
      { path: '', component: DashboardComponent },
      { path: 'menu', component: MenuTableComponent },
      { path: 'category', component: CategoryTableComponent },
      { path: 'sub_category', component: SubcategoryTableComponent },
      { path: 'brand', component: BrandTableComponent },
      { path: 'product', component: AdminProductsComponent },
      { path: 'order', component: OrdersTableComponent },
      { path: 'customer', component: CustomersComponent },
      { path: 'create-menu', component: MenuComponent },
      { path: 'create-menu/:id', component: MenuComponent },
      { path: 'create-category', component: CategoryComponent },
      { path: 'create-category/:id', component: CategoryComponent },
      { path: 'create-sub_category', component: SubcategoryComponent },
      { path: 'create-sub_category/:id', component: SubcategoryComponent },
      { path: 'create-brand', component: BrandsComponent },
      { path: 'create-brand/:id', component: BrandsComponent },
      { path: 'create-product', component: CreateProductComponent },
      { path: 'create-product/:id', component: CreateProductComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
