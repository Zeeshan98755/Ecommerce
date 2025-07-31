import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Order, Product, User } from '../../../../../Models/AppState';
import { OrderService } from '../../../../../State/Order/order.service';
import Swal from 'sweetalert2'
import { CartService } from '../../../../../State/Cart/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-address-form',
  templateUrl: './address-form.component.html',
  styleUrl: './address-form.component.scss'
})
export class AddressFormComponent implements OnInit {

  adresses: any[] = [];
  checkoutForm!: FormGroup;
  submitted = false;
  userData!: User;
  orderData!: Order;

  constructor(private fb: FormBuilder, private orderService: OrderService, private cartsrc: CartService, private route: Router) { }

  ngOnInit(): void {
    this.checkoutForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      streetAddress: ['', Validators.required],
      city: ['', Validators.required],
      zipCode: ['', [Validators.required]],
      mobile: ['', [Validators.required]]
    });

    this.loadUserData();
    this.getUserAddress();

    this.checkoutForm.valueChanges.subscribe((formValue) => {
      localStorage.setItem('user', JSON.stringify(formValue));
    });
  }

  get f() {
    return this.checkoutForm.controls;
  }

  getUserAddress() {
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      const userData = JSON.parse(storedUser);
      if (userData && userData.address) {
        this.adresses = [{ address: userData.address, city: userData.city, zipCode: userData.zipCode, mobNumber: userData.mobNumber }];
      }
    } else {
      console.error('User not found in localStorage');
    }
  }

  private loadUserData(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        if (userData && userData.firstName) {
          this.userData = userData;
          this.checkoutForm.patchValue({
            firstName: this.userData.firstName,
            lastName: this.userData.lastName,
            streetAddress: this.userData.address,
            city: this.userData.city,
            zipCode: this.userData.zipCode,
            mobile: this.userData.mobNumber
          });
        }
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
      }
    }
  }

  handleSubmit(): boolean {
    this.submitted = true;

    if (this.checkoutForm.invalid) {
      console.error('Form is invalid');
      return false;
    }

    this.userData = this.checkoutForm.value;
    localStorage.setItem('user', JSON.stringify(this.userData));
    console.log('User Data Stored:', this.userData);

    const storedProduct = localStorage.getItem('selectedProduct');
    if (!storedProduct) {
      console.error('No product found in localStorage');
      Swal.fire({
        title: 'Error ❗',
        text: 'No product selected. Please select a product before proceeding.',
        icon: 'error',
        customClass: {
          popup: 'bg-gray-900 text-white rounded-xl shadow-lg border border-gray-700',
          title: 'text-green-400 text-xl font-semibold',
          confirmButton: 'bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg',
          htmlContainer: 'text-gray-300 text-sm',
        },
        confirmButtonText: 'OK',
      });
      return false;
    }

    return true;
  }

  handleCreateOrder() {
    this.submitted = true;
    if (this.checkoutForm.invalid) {
      return;
    }

    // Generate a unique order ID
    const orderId = Math.random().toString(36).substr(2, 4);

    // Navigate to payment page with order_id and user details
    this.route.navigate([`/checkout/payment/${orderId}`]);
  }
}
