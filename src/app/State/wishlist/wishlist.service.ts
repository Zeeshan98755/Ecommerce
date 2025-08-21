import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { ApiService } from '../../service/api.service';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private wishlistItems = new BehaviorSubject<any[]>(this.getLocalStorageWishlist());
  wishlistItems$ = this.wishlistItems.asObservable();
  private wishlistUrl = 'http://localhost:3000/wishlist';

  constructor(private api: ApiService) { }

  getWishlist(): Observable<any[]> {
    return this.wishlistItems$;
  }

  getWishlistCount(): Observable<number> {
    return this.wishlistItems$.pipe(
      map(items => items.length)
    );
  }

  toggleWishlist(product: any) {
    const wishlist = this.getLocalStorageWishlist();
    const index = wishlist.findIndex(item => item.id === product.id);

    if (index > -1) {
      wishlist.splice(index, 1);
      this.api.delete(`${this.wishlistUrl}/${product.id}`).subscribe();
    } else {
      wishlist.push(product);
      this.api.post(this.wishlistUrl, product).subscribe();
    }

    this.updateLocalStorage(wishlist);
    this.wishlistItems.next(wishlist);
  }

  private updateLocalStorage(wishlist: any[]) {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }

  private getLocalStorageWishlist(): any[] {
    return JSON.parse(localStorage.getItem('wishlist') || '[]');
  }

  removeFromWishlist(product: any) {
    const wishlist = this.getLocalStorageWishlist();
    const index = wishlist.findIndex(item => item.id === product.id);
    if (index > -1) {
      wishlist.splice(index, 1);
      this.updateLocalStorage(wishlist);
      this.wishlistItems.next(wishlist);
      this.api.delete(`${this.wishlistUrl}/${product.id}`).subscribe();
    }
  }

}
