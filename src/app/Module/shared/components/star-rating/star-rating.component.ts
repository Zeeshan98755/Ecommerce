import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  templateUrl: './star-rating.component.html',
  styleUrl: './star-rating.component.scss'
})
export class StarRatingComponent {
  @Input() ratingKey: string = 'default-rating';
  @Output() totalRatingsChange = new EventEmitter<number>();
  @Output() ratingDistributionChange = new EventEmitter<any>();

  stars: number[];
  maxRating = 5;
  currentRating = 0;
  totalRatings = 0;
  ratingsArray: number[] = [];

  ratingDistribution = {
    excellent: 0,
    veryGood: 0,
    good: 0,
    average: 0,
    poor: 0,
  };

  constructor() {
    this.stars = Array(this.maxRating).fill(0).map((_, i) => i + 1);
  }

  ngOnInit() {
    this.loadRatings();
  }

  rate(rate: number) {
    this.currentRating = rate;

    const savedRatings = localStorage.getItem(this.ratingKey);
    this.ratingsArray = savedRatings ? JSON.parse(savedRatings) : [];

    this.ratingsArray.push(rate);
    this.totalRatings = this.ratingsArray.length;

    localStorage.setItem(this.ratingKey, JSON.stringify(this.ratingsArray));

    this.calculateRatingDistribution();
    this.emitRatings();
  }

  loadRatings() {
    const savedRatings = localStorage.getItem(this.ratingKey);
    if (savedRatings) {
      this.ratingsArray = JSON.parse(savedRatings);
      this.totalRatings = this.ratingsArray.length;

      if (this.ratingsArray.length > 0) {
        this.currentRating = this.ratingsArray[this.ratingsArray.length - 1];
      }

      this.calculateRatingDistribution();
      this.emitRatings();
    }
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

  emitRatings() {
    this.totalRatingsChange.emit(this.totalRatings);
    this.ratingDistributionChange.emit(this.ratingDistribution);
  }
}
