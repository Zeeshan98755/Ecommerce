import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent {
  @Input() product: any;

  constructor(private route: Router) { }

  navigate() {
    this.route.navigate([`product_details/${this.product.id}`]);
  }
}
