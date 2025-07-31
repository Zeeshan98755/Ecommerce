import { Injectable } from "@angular/core";
import { ApiService } from "../../service/api.service";
import { Router } from "@angular/router";
import { BehaviorSubject, catchError, map, Observable, of, throwError } from "rxjs";
import { CartService } from "../Cart/cart.service";
import { Order } from "../../Models/AppState";
import { LoginService } from "../Login/login.service";

@Injectable({
    providedIn: 'root',
})

export class OrderService {
    private order_url = "http://localhost:3000/orders/";
    private ordersSubject = new BehaviorSubject<Order[]>([]);
    orders$ = this.ordersSubject.asObservable();

    constructor(private apiService: ApiService, private router: Router, private cartsrc: CartService, private loginsrc: LoginService) { }

    createOrder(reqData: any) {
        const url = `${this.order_url}`;
        return this.apiService.post(url, reqData).pipe(
            map((data: any) => {
                console.log("Created Order", data);
                if (data.id) {
                    this.router.navigate([`/checkout/payment/${data.id}`], {
                        queryParams: { order_id: data.id }
                    });

                    localStorage.setItem('order', JSON.stringify(data));

                    const userId = reqData.userId;
                    if (userId) {
                        this.cartsrc.clearCart(userId);
                    }
                }
                return data;
            }),
            catchError((error: any) => {
                console.error("Order creation failed", error);
                return throwError(() => new Error(error.message || 'Order creation failed'));
            })
        );
    }

    getOrderById(orderId: string): Observable<Order> {
        const url = `${this.order_url}${orderId}`;
        return this.apiService.get(url).pipe(
            map((data: Order) => {
                console.log("Order by ID", data);
                return data;
            }),
            catchError((error: any) => {
                console.error("Failed to fetch order", error);
                return throwError(() => new Error(error.message || 'Failed to fetch order'));
            })
        );
    }

    getOrderHistory(): Observable<Order[]> {
        const userId = this.loginsrc.getUserId();
        if (!userId) {
            console.warn("No user logged in");
            return of([]);
        }

        return this.apiService.get(this.order_url).pipe(
            map((orders: Order[]) => {
                const filteredOrders = orders.filter(order => order.userId === userId);

                this.ordersSubject.next(filteredOrders);

                console.log("Filtered orders for user:", userId, filteredOrders);
                return filteredOrders;
            }),
            catchError((error: any) => {
                console.error("Failed to fetch order history", error);
                return throwError(() => new Error(error.message || 'Failed to fetch order history'));
            })
        );
    }

    clearOrders(): void {
        localStorage.removeItem('orders');
    }

    refreshOrderHistory(): Observable<Order[]> {
        localStorage.removeItem('orders');
        return this.getOrderHistory();
    }
}