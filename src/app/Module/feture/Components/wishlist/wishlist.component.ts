import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WishlistService } from '../../../../State/wishlist/wishlist.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.scss'
})
export class WishlistComponent {
  wishlist: any[] = [];
  paginatedwishlist: any[] = [];
  currentPage = 1;
  pageSize = 30;
  totalPages!: number;
  Math = Math;

  constructor(private wishlistsrc: WishlistService) { }
  ngOnInit(): void {
    this.wishlistsrc.getWishlist().subscribe(items => {
      this.wishlist = items;
    });
    this.totalPages = Math.ceil(this.wishlist.length / this.pageSize);
    this.updatePaginatedMenus();
  }

  removeFromWishlist(product: any) {
    this.wishlistsrc.toggleWishlist(product);
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
