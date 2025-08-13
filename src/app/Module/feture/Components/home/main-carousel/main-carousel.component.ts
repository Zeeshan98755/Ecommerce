import { Component, OnInit } from '@angular/core';
import { homeCarouselData } from '../../../../../../Data/mainCarousel';

@Component({
  selector: 'app-main-carousel',
  templateUrl: './main-carousel.component.html',
  styleUrl: './main-carousel.component.scss'
})
export class MainCarouselComponent implements OnInit {
  carouselDate: any;
  currentSlide = 0;
  interval: any;

  ngOnInit(): void {
    this.carouselDate = homeCarouselData;
    this.autoPlay();
  }

  autoPlay() {
    setInterval(() => {
      this.nextSlide();
    }, 2000)
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.carouselDate.length;
  }
}
