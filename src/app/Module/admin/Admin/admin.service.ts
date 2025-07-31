import { Injectable } from '@angular/core';
import { ApiService } from '../../../service/api.service';
import { catchError, forkJoin, map, Observable, switchMap, tap, throwError } from 'rxjs';
import { Order } from '../../../Models/AppState';
import { OrderService } from '../../../State/Order/order.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  public url = "http://localhost:3000/";
  private order_url = "http://localhost:3000/orders";

  constructor(private apiService: ApiService, private ordersrc: OrderService) { }

  allUser(endpoint: any): Observable<any> {
    return this.apiService.get(this.url + endpoint)
  }

  singleuUser(endpoint: any, user_id: any) {
    return this.apiService.get(`${this.url}${endpoint}` + user_id)
  }

  getmenu(endpoint: any): Observable<any> {
    return this.apiService.get(this.url + endpoint).pipe(
      catchError(this.handleError)
    );
  }

  getCategoriesByMenuId(menuId: string): Observable<any> {
    return this.apiService.get(`${this.url}categories?menuId=${menuId}`).pipe(
      catchError(this.handleError)
    );
  }

  getSubCategoriesByCategoryId(categoryId: string): Observable<any> {
    return this.apiService.get(`${this.url}subcategories?categoryId=${categoryId}`).pipe(
      catchError(this.handleError)
    );
  }

  getBrandByMenuId(menuId: string): Observable<any> {
    return this.apiService.get(`${this.url}brands?menuId=${menuId}`).pipe(
      catchError(this.handleError)
    );
  }

  getCategories(endpoint: any): Observable<any> {
    return this.apiService.get(this.url + endpoint).pipe(
      catchError(this.handleError)
    );
  }

  getsubCategories(endpoint: any): Observable<any> {
    return this.apiService.get(this.url + endpoint).pipe(
      catchError(this.handleError)
    );
  }

  getCategoryById(endpoint: any, id: number): Observable<any> {
    return this.apiService.get(`${this.url}${endpoint}/${id}`);
  }

  getbrands(endpoint: any): Observable<any> {
    return this.apiService.get(this.url + endpoint).pipe(
      catchError(this.handleError)
    );
  }

  allProduct(endpoint: any): Observable<any> {
    return this.apiService.get(this.url + endpoint).pipe(
      catchError(this.handleError)
    );
  }

  getProductsByBrand(brandId: string): Observable<any> {
    return this.apiService.get(`${this.url}products?brandId=${brandId}`).pipe(
      catchError(this.handleError)
    );
  }

  getOrders(): Observable<Order[]> {
    return this.apiService.get(this.order_url).pipe(
      switchMap((orders: any[]) => {
        return forkJoin(
          orders.map(order =>
            this.apiService.get(`http://localhost:3000/user/${order.userId}`).pipe(
              map(user => ({
                ...order,
                userName: user ? user.name : 'Unknown'
              }))
            )
          )
        );
      }),
      catchError(error => {
        console.error("API Error:", error);
        return throwError(() => new Error('Failed to fetch orders with user details.'));
      })
    );
  }

  updateOrderStatus(orderId: string, newStatus: string): Observable<any> {
    return this.apiService.get(`${this.order_url}/${orderId}`).pipe(
      switchMap((order: any) => {
        if (order.status === 'CANCELLED') {
          console.warn(`Order ${orderId} is already cancelled and cannot be updated.`);
          return throwError(() => new Error('Cannot update a cancelled order.'));
        }

        return this.apiService.patch(`${this.order_url}/${orderId}`, { status: newStatus }).pipe(
          tap(() => console.log(`Order ${orderId} updated to ${newStatus}`))
        );
      }),
      catchError(error => {
        console.error("Update Error:", error);
        return throwError(() => new Error('Failed to update order status.'));
      })
    );
  }

  addMenu(endpoint: any, data: any): Observable<any> {
    return this.apiService.post(`${this.url}${endpoint}`, data).pipe(
      catchError(this.handleError)
    );
  }

  addCategory(endpoint: any, data: any): Observable<any> {
    return this.apiService.post(`${this.url}${endpoint}`, data).pipe(
      catchError(this.handleError)
    );
  }

  addsubCategory(endpoint: any, data: any): Observable<any> {
    return this.apiService.post(`${this.url}${endpoint}`, data).pipe(
      catchError(this.handleError)
    );
  }

  addbrand(endpoint: any, data: any): Observable<any> {
    return this.apiService.post(`${this.url}${endpoint}`, data).pipe(
      catchError(this.handleError)
    );
  }

  addProduct(endpoint: any, data: any): Observable<any> {
    return this.apiService.post(`${this.url}${endpoint}`, data).pipe(
      catchError(this.handleError)
    );
  }

  updateMenu(id: string, menu: any): Observable<any> {
    return this.apiService.put(`${this.url}menu/${id}`, menu).pipe(
      catchError(this.handleError)
    );
  }

  updateCategory(id: string, category: any): Observable<any> {
    return this.apiService.put(`${this.url}categories/${id}`, category).pipe(
      catchError(this.handleError)
    );
  }

  updatesubCategory(id: string, subcategory: any): Observable<any> {
    return this.apiService.put(`${this.url}subcategories/${id}`, subcategory).pipe(
      catchError(this.handleError)
    );
  }

  updateBrand(id: string, brand: any): Observable<any> {
    return this.apiService.put(`${this.url}brands/${id}`, brand).pipe(
      catchError(this.handleError)
    );
  }

  updateProduct(id: string, product: any): Observable<any> {
    return this.apiService.put(`${this.url}products/${id}`, product).pipe(
      catchError(this.handleError)
    );
  }

  deleteUser(endpoint: any, user_id: any) {
    return this.apiService.delete(`${this.url}${endpoint}` + user_id)
  }

  deleteMenu(endpoint: any, id: string): Observable<any> {
    return this.apiService.delete(`${this.url}${endpoint}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  deleteCategory(endpoint: any, id: string): Observable<any> {
    return this.apiService.delete(`${this.url}${endpoint}/${id}`);
  }

  deleteSubCategory(endpoint: any, id: string): Observable<any> {
    return this.apiService.delete(`${this.url}${endpoint}/${id}`);
  }

  deleteBrand(endpoint: any, id: string): Observable<any> {
    return this.apiService.delete(`${this.url}${endpoint}/${id}`);
  }

  deleteProduct(endpoint: any, id: string): Observable<any> {
    return this.apiService.delete(`${this.url}${endpoint}/${id}`);
  }

  deleteOrder(id: string, userId: string): Observable<any> {
    return this.apiService.patch(`${this.order_url}/${id}`, { status: 'Cancelled' }).pipe(
      tap(() => {
        console.log(`Order ${id} marked as Cancelled.`);
      }),
      catchError(error => {
        console.error("Delete Order Error:", error);
        return throwError(() => new Error('Failed to delete order.'));
      })
    );
  }

  private handleError(error: any) {
    console.error("API Error:", error);
    return throwError(() => new Error('Something went wrong with the API.'));
  }
}
