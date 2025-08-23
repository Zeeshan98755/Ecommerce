import { Component, OnDestroy, OnInit } from '@angular/core';
import { WishlistService } from '../../../../State/wishlist/wishlist.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.scss'
})
export class WishlistComponent implements OnInit, OnDestroy {
  wishlist: any[] = [];
  paginatedwishlist: any[] = [];
  currentPage = 1;
  pageSize = 30;
  totalPages!: number;
  Math = Math;
  private wishlistSubscription!: Subscription;

  constructor(private wishlistsrc: WishlistService) { }

  ngOnInit(): void {
    this.wishlistSubscription = this.wishlistsrc.getWishlist().subscribe(items => {
      this.wishlist = items;
      this.totalPages = Math.ceil(this.wishlist.length / this.pageSize);

      // Adjust current page if it becomes invalid after removal
      if (this.currentPage > this.totalPages && this.totalPages > 0) {
        this.currentPage = this.totalPages;
      } else if (this.totalPages === 0) {
        this.currentPage = 1;
      }

      this.updatePaginatedMenus();
    });
  }

  ngOnDestroy(): void {
    if (this.wishlistSubscription) {
      this.wishlistSubscription.unsubscribe();
    }
  }

  removeFromWishlist(product: any) {
    this.wishlistsrc.removeFromWishlist(product);
  }

  onPageChange(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePaginatedMenus();
  }

  updatePaginatedMenus() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedwishlist = this.wishlist.slice(startIndex, endIndex);
  }

  getPageRange(): number[] {
    const range = [];
    const maxPagesToShow = 5;
    const halfMaxPages = Math.floor(maxPagesToShow / 2);

    let startPage = this.currentPage - halfMaxPages;
    let endPage = this.currentPage + halfMaxPages;

    if (startPage < 1) {
      startPage = 1;
      endPage = Math.min(maxPagesToShow, this.totalPages);
    }

    if (endPage > this.totalPages) {
      endPage = this.totalPages;
      startPage = Math.max(1, this.totalPages - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      range.push(i);
    }

    return range;
  }
}
