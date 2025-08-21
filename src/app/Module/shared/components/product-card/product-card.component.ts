import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WishlistService } from '../../../../State/wishlist/wishlist.service';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent implements OnInit {
  @Input() product: any;
  currentUrl: string = '';
  wishlist: any[] = [];

  constructor(private route: Router, private wishlistsrc: WishlistService) {
    this.route.events.subscribe(() => {
      this.currentUrl = this.route.url;
    });
  }

  ngOnInit() {
    this.wishlistsrc.getWishlist().subscribe(items => {
      this.wishlist = items;
      this.product.isWishlisted = this.wishlist.some((item: any) => item.id === this.product.id);
    });
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

  removeFromWishlist(product: any, event: Event) {
    event.stopPropagation();
    this.wishlistsrc.removeFromWishlist(product);
  }

  isWishlistPage(): boolean {
    return this.currentUrl.includes('/wishlist');
  }

  isWishlisted(): boolean {
    return this.wishlist.some(item => item.id === this.product.id);
  }
}
