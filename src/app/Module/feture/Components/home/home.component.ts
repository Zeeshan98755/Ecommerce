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
    this.loadBrands('7013', 'jeans', 'menBrands');
    this.loadBrands('a6ad', 'gown', 'womenGoun');
    this.loadBrands('a6ad', 'lehenga choli', 'lenghaCholi');
    this.loadBrands('7013', 'kurta', 'menKurta');
    this.loadBrands('7013', 'shoes', 'mensShoe');
  }

  brandsMap: { [key: string]: any[] } = {
    menBrands: [],
    womenGoun: [],
    lenghaCholi: [],
    menKurta: [],
    mensShoe: []
  };

  loadBrands(menuId: string, keyword: string, targetKey: string) {
    this.adminService.getBrandByMenuId(menuId).subscribe((res: any[]) => {
      this.brandsMap[targetKey] = res.filter(brand =>
        brand.name && brand.image && brand.title && brand.title.toLowerCase().includes(keyword.toLowerCase())
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