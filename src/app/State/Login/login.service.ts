import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { ApiService } from '../../service/api.service';
import { CartService } from '../Cart/cart.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private user_url = "http://localhost:3000/user";

  constructor(private apiService: ApiService, private cartService: CartService) { }

  authLogin(email: string, password: string): Observable<any> {
    return this.apiService.get(`${this.user_url}?email=${email}`).pipe(
      map((users: any[]) => {
        if (users.length > 0) {
          const user = users.find(u => u.password === password);
          if (user) {
            this.setUserToLocalStorage(user);
            console.log('Logged-in user:', user);
            this.cartService.loadCart();
            return user;
          } else {
            throw new Error('Invalid email or password');
          }
        } else {
          throw new Error('Invalid email or password');
        }
      }),
      catchError(error => {
        console.error('Login error:', error);
        return throwError(() => new Error('Login failed. Please check your credentials.'));
      })
    );
  }

  userRegister(user_dto: any): Observable<any> {
    return this.apiService.get(this.user_url).pipe(
      switchMap((users: any[]) => {
        const emailExists = users.some(user => user.email === user_dto.email);
        const mobileExists = users.some(user => user.mobNumber === user_dto.mobNumber);

        if (emailExists) {
          return throwError(() => new Error('Email already exists'));
        }
        if (mobileExists) {
          return throwError(() => new Error('Mobile number already exists'));
        }

        const newUser = { ...user_dto, role: 'customer' };

        return this.apiService.post(this.user_url, newUser);
      }),
      catchError(error => {
        console.error('Registration error:', error);
        return throwError(() => new Error(error.message));
      })
    );
  }

  adminLogin(email: string, password: string): Observable<any> {
    return this.apiService.get(`${this.user_url}?email=${email}&password=${password}&role=admin`).pipe(
      map((users: any[]) => {
        if (users.length > 0) {
          this.cartService.loadCart();
          return users[0];
        } else {
          throw new Error('Invalid admin credentials');
        }
      }),
      catchError(error => {
        console.error('Admin login error:', error);
        return throwError(() => new Error('Admin login failed.'));
      })
    );
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('user');
  }

  private setUserToLocalStorage(user: any): void {
    if (!user.role) {
      user.role = 'customer';
    }
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('role', user.role);
    localStorage.setItem('userId', user.id);

    this.cartService.loadCart();
  }

  getUserId() {
    const userId = localStorage.getItem('userId');
    return userId;
  }
}
