import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-slider',
  templateUrl: './product-slider.component.html',
  styleUrl: './product-slider.component.scss'
})
export class ProductSliderComponent {
  @Input() title!: string;
  @Input() products!: any[];

  constructor(private router: Router) {}

  // Handle brand click
  onBrandClick(brand: any) {
    this.router.navigate(['/products', brand.id]);
  }
}
