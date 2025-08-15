import { Component, OnInit } from '@angular/core';
import { filters, singleFilter } from './FilterData';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../../State/Product/product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit {
  filtersData: any;
  singlefiltersData: any;
  products: any[] = [];
  paginatedproducts: any[] = [];
  lavelThree: any;
  currentPage = 1;
  pageSize = 30;
  totalPages!: number;
  brandId!: string;
  showTopClearButton: boolean = true;
  Math = Math;

  constructor(
    private activateRoute: ActivatedRoute,
    private route: Router,
    private prosrc: ProductService) { }

  ngOnInit(): void {
    this.filtersData = filters.map(item => ({
      ...item,
      options: item.options.map(option => ({
        ...option,
        selected: false
      }))
    }));

    this.singlefiltersData = singleFilter.map(item => ({
      ...item,
      selected: null,
      options: item.options.map(option => ({
        ...option
      }))
    }));

    this.activateRoute.params.subscribe((params: { [x: string]: string }) => {
      this.brandId = params['brandId'];
      this.loadProducts();
    });

    this.activateRoute.queryParams.subscribe((queryParams) => {
      this.updateFilterSelections(queryParams); // set selected = true
      this.loadProducts();
    });
    this.totalPages = Math.ceil(this.products.length / this.pageSize);
    this.updatePaginatedMenus();
  }

  updateFilterSelections(queryParams: any) {
    // Handle checkbox filters
    this.filtersData.forEach((item: { id: string | number; options: any[]; }) => {
      const selectedValues = queryParams[item.id]?.split(',') || [];
      item.options.forEach((option: { selected: any; value: any; }) => {
        option.selected = selectedValues.includes(option.value);
      });
    });

    // Handle radio filters
    this.singlefiltersData.forEach((item: { id: string | number; selected: any; }) => {
      const selectedValue = queryParams[item.id] || null;
      item.selected = selectedValue;
    });
  }

  loadProducts() {
    const subcategoryId = this.activateRoute.snapshot.queryParams['subcategoryId'];
    const brandId = this.brandId || this.activateRoute.snapshot.queryParams['brandId'];
    const color = this.activateRoute.snapshot.queryParams['color'];
    const priceParam = this.activateRoute.snapshot.queryParams['price'] || '';
    const discountParam = this.activateRoute.snapshot.queryParams['disprice'] || '0';
    const sort = this.activateRoute.snapshot.queryParams['sort'];

    let minPrice = 0;
    let maxPrice = 100000;

    if (priceParam) {
      const decodedPrice = decodeURIComponent(priceParam);
      const priceRange = decodedPrice.split("-").map(p => parseFloat(p.trim()));

      minPrice = priceRange.length > 0 && !isNaN(priceRange[0]) ? priceRange[0] : 0;
      maxPrice = priceRange.length > 1 && !isNaN(priceRange[1]) ? priceRange[1] : 100000;
    }

    const minDiscount = parseInt(discountParam, 10);

    this.prosrc.getProducts('products').subscribe(
      (data) => {
        const uniqueProductsMap = new Map();

        data.forEach((product) => {
          const key = `${product.image}`;
          if (!uniqueProductsMap.has(key)) {
            uniqueProductsMap.set(key, product);
          }
        });

        this.products = Array.from(uniqueProductsMap.values()).filter((product) => {
          const productColors = Array.isArray(product.color) ? product.color : [product.color];

          return (
            (!subcategoryId || product.subcategoryId === subcategoryId) &&
            (!brandId || product.brandId === brandId) &&
            product.disprice >= minPrice &&
            product.disprice <= maxPrice &&
            product.dispercent >= minDiscount &&
            (color ? color.split(',').some((c: any) => productColors.includes(c)) : true)
          );
        });

        this.showTopClearButton = this.products.length > 0;

        if (sort === 'price_high') {
          this.products.sort((a, b) => b.disprice - a.disprice);
        } else if (sort === 'price_low') {
          this.products.sort((a, b) => a.disprice - b.disprice);
        }

        this.totalPages = Math.ceil(this.products.length / this.pageSize);

        if (this.currentPage > this.totalPages) {
          this.currentPage = 1;
        }

        this.updatePaginatedMenus();
      },
      (error) => {
        console.error("Error fetching products:", error);
      }
    );
  }

  handleMultipleSelectFilter(value: string, sectionId: string) {
    const queryParams = { ...this.activateRoute.snapshot.queryParams };
    console.log("query params", queryParams);
    const filterValues = queryParams[sectionId] ? queryParams[sectionId].split(",") : [];

    const valueIndex = filterValues.indexOf(value);

    if (valueIndex != -1) {
      filterValues.splice(valueIndex, 1)
    }
    else {
      filterValues.push(value);
    }

    if (filterValues.length > 0) {
      queryParams[sectionId] = filterValues.join(",")
    }
    else {
      delete queryParams[sectionId];
    }
    this.route.navigate([], { queryParams });
  }

  handleSingleSelectFilter(value: string, sectionId: string) {
    const queryParams = { ...this.activateRoute.snapshot.queryParams };

    if (sectionId === "price") {
      value = value.replace(/\s+/g, "");
    }

    queryParams[sectionId] = value;
    this.route.navigate([], { queryParams });
  }

  clearFilters() {
    const currentQueryParams = { ...this.activateRoute.snapshot.queryParams };
    const filterKeys = ['color', 'size', 'price', 'disprice', 'stock', 'sort'];

    filterKeys.forEach(key => delete currentQueryParams[key]);

    this.route.navigate([], {
      relativeTo: this.activateRoute,
      queryParams: currentQueryParams,
      replaceUrl: true,
    });

    // Reset selections
    this.filtersData.forEach((item: { options: any[]; }) => {
      item.options.forEach((option: { selected: boolean; }) => {
        option.selected = false;
      });
    });

    this.singlefiltersData.forEach((item: { selected: null; }) => {
      item.selected = null;
    });
  }

  onPageChange(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePaginatedMenus();
  }

  updatePaginatedMenus() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedproducts = this.products.slice(startIndex, endIndex);
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
