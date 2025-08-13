import { Injectable, Injector } from "@angular/core";
import { ApiService } from "../../service/api.service";
import { BehaviorSubject, forkJoin, map, Observable, tap } from "rxjs";
import { LoginService } from "../Login/login.service";

@Injectable({
    providedIn: 'root',
})

export class CartService {
    private cart_url = 'http://localhost:3000/cart';
    private cartItems = new BehaviorSubject<any[]>(this.getLocalStorageCart());

    cartItems$ = this.cartItems.asObservable();

    public loginsrc!: LoginService;
    constructor(private apisrc: ApiService, private injector: Injector) {
        setTimeout(() => {
            this.loginsrc = this.injector.get(LoginService);
            this.loadCart();
        });
    }

    loadCart() {
        const userId = this.loginsrc.getUserId();
        if (!userId) {
            this.cartItems.next([]);
            return;
        }

        this.apisrc.get(`${this.cart_url}?userId=${userId}`).subscribe(
            (cart) => {
                this.cartItems.next(cart);
                this.updateLocalStorage(cart);
            },
            (error) => {
                console.error('Error fetching cart, using LocalStorage');
                const localCart = this.getLocalStorageCart().filter(item => item.userId === userId);
                this.cartItems.next(localCart);
            }
        );
    }

    addToCart(product: any) {
        const userId = this.loginsrc.getUserId();
        if (!userId) {
            console.error('User not logged in');
            return;
        }

        let cart = this.getLocalStorageCart();
        let existingItem = cart.find(
            (item) => item.productId === product.productId && item.size === product.size && item.userId === userId
        );

        if (existingItem) {
            console.log("Existing Item Found:", existingItem);
            if (!existingItem.id) {
                console.error("Error: Existing item has no ID", existingItem);
                return;
            }
            existingItem.quantity += 1;
            this.updateLocalStorage(cart);
            this.cartItems.next(cart);
            localStorage.setItem('selectedProduct', JSON.stringify(existingItem));
            return this.apisrc.patch(`${this.cart_url}/${existingItem.id}`, { quantity: existingItem.quantity });
        } else {
            let cartItem = { ...product, quantity: 1, userId };
            cart.push(cartItem);
            this.updateLocalStorage(cart);
            this.cartItems.next(cart);
            localStorage.setItem('selectedProduct', JSON.stringify(cartItem));
            return this.apisrc.post(this.cart_url, cartItem);
        }
    }

    updateCartQuantity(cartItemId: string, quantity: number) {
        return this.apisrc.patch(`${this.cart_url}/${cartItemId}`, { quantity });
    }

    removeFromCart(cartItemId: string) {
        let cart = this.getLocalStorageCart().filter((item) => item.id !== cartItemId);
        this.updateLocalStorage(cart);

        this.apisrc.delete(`${this.cart_url}/${cartItemId}`).subscribe(() => {
            this.loadCart();
        });
    }

    clearCart(userId: string): void {
        this.cartItems.next([]);
        localStorage.removeItem('cart');

        this.apisrc.get(`${this.cart_url}?userId=${userId}`).subscribe(
            (cartItems: any[]) => {
                cartItems.forEach((item) => {
                    this.apisrc.delete(`${this.cart_url}/${item.id}`).subscribe(
                        () => console.log(`Deleted cart item: ${item.id}`),
                        (error) => console.error(`Error deleting cart item ${item.id}:`, error)
                    );
                });
            },
            (error) => {
                console.error('Error fetching cart items for deletion:', error);
            }
        );
    }

    getCartCount(): Observable<number> {
        return this.cartItems$.pipe(
            map((items: any[]) => items ? items.reduce((total, item) => total + item.quantity, 0) : 0)
        );
    }

    private updateLocalStorage(cart: any[]) {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    private getLocalStorageCart(): any[] {
        return JSON.parse(localStorage.getItem('cart') || '[]');
    }
}