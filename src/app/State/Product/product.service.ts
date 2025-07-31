import { Injectable } from "@angular/core";
import { catchError, map, Observable, of, tap, throwError } from "rxjs";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { ApiService } from "../../service/api.service";

@Injectable({
    providedIn: 'root',
})

export class ProductService {
    private product_url = "http://localhost:3000/";


    constructor(private apiService: ApiService) { }
    private storeInLocalStorage(key: string, data: any[]): void {
        localStorage.setItem(key, JSON.stringify(data));
    }

    private getFromLocalStorage(key: string): any[] {
        const storedData = localStorage.getItem(key);
        return storedData ? JSON.parse(storedData) : [];
    }

    getProducts(endpoint: string): Observable<any[]> {
        const url = `${this.product_url}${endpoint}`;
        return this.apiService.get(url).pipe(
            tap(data => this.storeInLocalStorage(endpoint, data)),
            catchError(error => {
                console.error('Error fetching products:', error);
                return throwError(() => new Error('Something went wrong'));
            })
        );
    }

    getProductsFromLocal(endpoint: string): Observable<any[]> {
        return of(this.getFromLocalStorage(endpoint));
    }

    findProductsByCategory(endpoint: string, reqData: any): Observable<any[]> {
        let { colors, sizes, minPrice, maxPrice, minDiscount, category, stock, sort, pageNumber, pageSize } = reqData;
        let params: any = {};

        if (colors && colors.length > 0) params.color = colors.join(",");
        if (sizes && sizes.length > 0) params.size = sizes.join(",");
        if (minPrice) params.disprice_gte = minPrice;
        if (maxPrice) params.disprice_lte = maxPrice; 
        if (minDiscount) params.dispercent_gte = minDiscount; 
        if (category) params.categoryId = category;
        if (stock) params.stock_gte = stock;
        if (sort) params._sort = sort;
        if (pageNumber && pageSize) {
            params._page = pageNumber;
            params._limit = pageSize;
        }

        const url = `${this.product_url}${endpoint}`;

        return this.apiService.get(url, params).pipe(
            tap(data => this.storeInLocalStorage(endpoint, data)),
            catchError(error => {
                console.error('Error fetching products:', error);
                return throwError(() => new Error('Something went wrong'));
            })
        );
    }

    findProductById(endpoint: string, productId: string): Observable<any> {
        return this.apiService.get(`${this.product_url}${endpoint}/${productId}`).pipe(
            catchError(error => {
                console.error('Error fetching product:', error);
                return throwError(() => new Error('Something went wrong'));
            })
        );
    }

    clearProducts(): void {
        localStorage.removeItem('products');
    }

}