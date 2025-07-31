import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-product-review-card',
  templateUrl: './product-review-card.component.html',
  styleUrl: './product-review-card.component.scss'
})
export class ProductReviewCardComponent implements OnInit, OnChanges {
  @Input() product!: any;
  @Input() productId!: string;
  @Input() reviewId!: string;
  @Input() review!: any;
  totalRatings = 0;
  userRating = 0;
  ratingsArray: number[] = [];

  ratingDistribution = {
    excellent: 0,
    veryGood: 0,
    good: 0,
    average: 0,
    poor: 0,
  };

  ngOnInit() {
    if (this.productId && this.reviewId) {
      this.loadUserRating();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['productId'] || changes['reviewId']) {
      this.loadUserRating();
    }
  }

  updateUserRating(rating: number) {
    this.userRating = rating;
    this.saveUserRating(rating);
  }

  loadUserRating() {
    if (!this.productId || !this.reviewId) return;

    const storedRatings = localStorage.getItem(`ratings_${this.productId}_${this.reviewId}`);
    if (storedRatings) {
      this.ratingsArray = JSON.parse(storedRatings);
      this.totalRatings = this.ratingsArray.length;
      this.userRating = this.ratingsArray.length > 0 ? this.ratingsArray[this.ratingsArray.length - 1] : 0;
      this.calculateRatingDistribution();
    }
  }

  saveUserRating(rating: number) {
    if (!this.productId || !this.reviewId) return;

    let storedRatings = localStorage.getItem(`ratings_${this.productId}_${this.reviewId}`);
    this.ratingsArray = storedRatings ? JSON.parse(storedRatings) : [];

    this.ratingsArray.push(rating);
    localStorage.setItem(`ratings_${this.productId}_${this.reviewId}`, JSON.stringify(this.ratingsArray));

    this.totalRatings = this.ratingsArray.length;
    this.calculateRatingDistribution();
  }

  calculateRatingDistribution() {
    const counts = { excellent: 0, veryGood: 0, good: 0, average: 0, poor: 0 };

    this.ratingsArray.forEach((rating) => {
      if (rating === 5) counts.excellent++;
      else if (rating === 4) counts.veryGood++;
      else if (rating === 3) counts.good++;
      else if (rating === 2) counts.average++;
      else if (rating === 1) counts.poor++;
    });

    this.ratingDistribution = {
      excellent: (counts.excellent / this.totalRatings) * 100 || 0,
      veryGood: (counts.veryGood / this.totalRatings) * 100 || 0,
      good: (counts.good / this.totalRatings) * 100 || 0,
      average: (counts.average / this.totalRatings) * 100 || 0,
      poor: (counts.poor / this.totalRatings) * 100 || 0,
    };
  }

  updateTotalRatings(count: number) {
    this.totalRatings = count;
  }
}
