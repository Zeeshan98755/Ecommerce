import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../Admin/admin.service';
import { Product } from '../../../../Models/AppState';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  customers: any[] = [];
  products: Product[] = [];

  constructor(private adminService: AdminService) { }
  ngOnInit(): void {
    this.getAllUser();
    this.getAllproduct();
  }

  getAllUser() {
    this.adminService.allUser('user').subscribe(
      (data) => {
        this.customers = data.slice(0, 10).map((user: any) => ({
          id: user.id,
          initial: user.firstName.charAt(0).toUpperCase(),
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          image: user.image || null,
          avatarColor: this.getRandomColor(),
        }));
      },
      (error) => {
        console.error("Error fetching users:", error);
      }
    );
  }

  getAllproduct() {
    this.adminService.allProduct('products').subscribe(
      (data) => {
        this.products = data.slice(0, 10).map((product: any) => ({
          id: product.id,
          image: product.image,
          title: product.title,
          disprice: product.disprice,
          price: product.price,
          quantity: product.quantity,
        }));
      },
      (error) => {
        console.error("Error fetching products:", error);
      }
    );
  }

  getRandomColor(): string {
    const colors = ['bg-orange-500', 'bg-purple-500', 'bg-blue-500', 'bg-green-500'];
    return colors[Math.floor(Math.random() * colors.length)];
  }
}
