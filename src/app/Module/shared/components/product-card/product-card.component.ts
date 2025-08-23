import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WishlistService } from '../../../../State/wishlist/wishlist.service';
import { CartService } from '../../../../State/Cart/cart.service';
import Swal from 'sweetalert2';
import { LoginService } from '../../../../State/Login/login.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent implements OnInit, OnDestroy {
  @Input() product: any;
  @Input() isWishlistContext: boolean = false; // New input to determine context
  wishlist: any[] = [];
  private wishlistSubscription!: Subscription;

  constructor(
    private route: Router,
    private wishlistsrc: WishlistService,
    private cartsrc: CartService,
    private router: Router,
    private loginsrc: LoginService
  ) { }

  ngOnInit() {
    // Subscribe to wishlist changes
    this.wishlistSubscription = this.wishlistsrc.getWishlist().subscribe(items => {
      this.wishlist = items;
      if (this.product) {
        this.product.isWishlisted = this.wishlist.some((item: any) => item.id === this.product.id);
      }
    });
  }

  ngOnDestroy() {
    if (this.wishlistSubscription) {
      this.wishlistSubscription.unsubscribe();
    }
  }

  navigate() {
    this.route.navigate([`product_details/${this.product.id}`]);
  }

  toggleWishlist(product: any, event: Event) {
    event.stopPropagation();
    this.wishlistsrc.toggleWishlist(product);

    // Ripple effect
    product.showRipple = true;
    setTimeout(() => (product.showRipple = false), 600);
  }

  handleAddToCart() {
    if (!this.loginsrc.isLoggedIn()) {
      Swal.fire({
        title: 'Login Required ❗',
        text: 'Please login first to add items to your cart.',
        icon: 'warning',
        customClass: {
          popup: 'bg-gray-900 text-white rounded-xl shadow-lg border border-gray-700',
          title: 'text-yellow-400 text-xl font-semibold',
          confirmButton: 'bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg',
          htmlContainer: 'text-gray-300 text-sm',
        },
        confirmButtonText: 'Login',
      }).then(() => {
        this.router.navigate(['login']);
      });
      return;
    }

    const cartItem = {
      productId: this.product.id,
      menuId: this.product.menuId,
      categoryId: this.product.categoryId,
      subcategoryId: this.product.subcategoryId,
      brandId: this.product.brandId,
      image: this.product.image,
      title: this.product.title,
      color: this.product.color,
      price: this.product.price,
      disprice: this.product.disprice,
      dispercent: this.product.dispercent,
      quantity: 1,
      userId: this.loginsrc.getUserId(),
    };

    this.cartsrc.addToCart(cartItem)?.subscribe(() => {
      Swal.fire({
        title: 'Added to Cart! 🛒',
        text: `${this.product.title} has been added to your cart.`,
        icon: 'success',
        customClass: {
          popup: 'bg-gray-900 text-white rounded-xl shadow-lg border border-gray-700',
          title: 'text-green-400 text-xl font-semibold',
          confirmButton: 'bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg',
          htmlContainer: 'text-gray-300 text-sm',
        },
        confirmButtonText: 'OK',
      }).then(() => {
        this.router.navigate(['cart']);
      });
    });
  }

  removeFromWishlist(product: any, event: Event) {
    event.stopPropagation();
    this.wishlistsrc.removeFromWishlist(product);
  }

  isWishlistPage(): boolean {
    return this.isWishlistContext;
  }

  isWishlisted(): boolean {
    return this.wishlist.some(item => item.id === this.product.id);
  }
}
