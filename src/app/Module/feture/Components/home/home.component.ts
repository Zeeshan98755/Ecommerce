import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../admin/Admin/admin.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  menBrands: any[] = [];
  womenGoun: any[] = [];
  lenghaCholi: any[] = [];
  menKurta: any[] = [];
  mensShoe: any[] = [];
  selectedProducts: any[] = [];
  isLoading: boolean = false;

  constructor(private adminService: AdminService) { }

  ngOnInit() {
    this.loadMenBrands();
    this.loadwomenGoun();
    this.loadlenghaCholi();
    this.loadmenKurta();
    this.loadmensShoe();
  }

  loadMenBrands() {
    this.adminService.getBrandByMenuId('7013').subscribe((res) => {
      this.menBrands = res.filter((brand: any) =>
        brand.name && brand.image && brand.title && brand.title.toLowerCase().includes('jeans')
      );
    });
  }
  
  loadwomenGoun() {
    this.adminService.getBrandByMenuId('a6ad').subscribe((res) => {
      this.womenGoun = res.filter((brand: any) =>
        brand.name && brand.image && brand.title && brand.title.toLowerCase().includes('gown')
      );
    });
  }

  loadlenghaCholi() {
    this.adminService.getBrandByMenuId('a6ad').subscribe((res) => {
      this.lenghaCholi = res.filter((brand: any) =>
        brand.name && brand.image && brand.title && brand.title.toLowerCase().includes('lehenga choli')
      );
    });
  }

  loadmenKurta() {
    this.adminService.getBrandByMenuId('7013').subscribe((res) => {
      this.menKurta = res.filter((brand: any) =>
        brand.name && brand.image && brand.title && brand.title.toLowerCase().includes('kurta')
      );
    });
  }

  loadmensShoe() {
    this.adminService.getBrandByMenuId('7013').subscribe((res) => {
      this.mensShoe = res.filter((brand: any) =>
        brand.name && brand.image && brand.title && brand.title.toLowerCase().includes('shoes')
      );
    });
  }

  loadProducts(brand: any) {
    this.isLoading = true;
    this.adminService.getProductsByBrand(brand.id).subscribe((res) => {
      this.selectedProducts = res;
      this.isLoading = false;
    });
  }
}
