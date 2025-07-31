import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CartService } from '../../../../State/Cart/cart.service';

@Component({
  selector: 'app-cart-item',
  templateUrl: './cart-item.component.html',
  styleUrl: './cart-item.component.scss'
})
export class CartItemComponent {
  @Input() cartItem: any;
  @Input() index!: number;
  @Output() cartUpdated = new EventEmitter<void>();

  constructor(private cartService: CartService) { }

  updateCartItem(change: number) {
    if (this.cartItem.quantity + change > 0) {
      this.cartItem.quantity += change;

      this.cartService.updateCartQuantity(this.cartItem.id, this.cartItem.quantity)
        .subscribe(() => this.cartUpdated.emit());
    }
  }

  removeCartItem() {
    if (!this.cartItem.id) return;

    this.cartService.removeFromCart(this.cartItem.id);
    this.cartUpdated.emit();
  }

  getColorClass(color: string): string {
    const colorClasses: { [key: string]: string } = {
      'White': 'text-white border-gray-300 bg-gray-100 shadow text-gray-900',
      'Black': 'text-black border-gray-800 bg-gray-900 shadow-lg text-white',
      'Red': 'text-red-500 border-red-500 bg-red-100 shadow-red-500/50',
      'Purple': 'text-purple-500 border-purple-500 bg-purple-100 shadow-purple-500/50',
      'Brown': 'text-amber-700 border-amber-700 bg-amber-100 shadow-amber-700/50',
      'Pink': 'text-pink-500 border-pink-500 bg-pink-100 shadow-pink-500/50',
      'Green': 'text-green-500 border-green-500 bg-green-100 shadow-green-500/50',
      'Yellow': 'text-yellow-500 border-yellow-500 bg-yellow-100 shadow-yellow-500/50',
      'Blue': 'text-blue-500 border-blue-500 bg-blue-100 shadow-blue-500/50',
      'Grey': 'text-gray-500 border-gray-500 bg-gray-100 shadow-gray-500/50',
      'Orange': 'text-orange-500 border-orange-500 bg-orange-100 shadow-orange-500/50',
      'Gold': 'text-yellow-400 border-yellow-400 bg-yellow-100 shadow-yellow-400/50'
    };

    return colorClasses[color] || 'text-white border-gray-300 bg-gray-100 shadow';
  }
}
