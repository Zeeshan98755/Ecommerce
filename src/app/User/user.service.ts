import { Injectable } from '@angular/core';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { ApiService } from '../service/api.service';
import { BehaviorSubject, Observable, throwError } from 'rxjs';

@Injectable({
    providedIn: 'root',
})

export class UserService {
    private user_url = 'http://localhost:3000/user/';
    public userProfileSource = new BehaviorSubject<any>(this.getUserFromLocalStorage());
    userProfile$ = this.userProfileSource.asObservable();

    constructor(private apiService: ApiService) { }

    fetchUserProfile(email: string): Observable<any> {
        const params = new HttpParams().set('email', email);
        return this.apiService.get(this.user_url, params).pipe(
            map(users => {
                const user = users[0] || null;
                if (user) {
                    this.setUserProfile(user);
                }
                return user;
            }),
            catchError(error => {
                console.error("Error fetching user profile:", error);
                return throwError(() => error);
            })
        );
    }

    updateUserProfile(user_id: number, user_dto: any): Observable<any> {
        return this.apiService.put(`${this.user_url}${user_id}`, user_dto).pipe(
            map(updatedUser => {
                this.setUserProfile(updatedUser);
                return updatedUser;
            }),
            catchError(error => {
                console.error("Error updating user profile:", error);
                return throwError(() => error);
            })
        );
    }

    logout(): void {
        this.clearUserProfile();
        setTimeout(() => location.reload(), 100);
    }

    setUserProfile(user: any): void {
        this.userProfileSource.next(user);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('user_role', user.role || 'customer');
    }

    clearUserProfile(): void {
        this.userProfileSource.next(null);
        localStorage.removeItem('user');
        localStorage.removeItem('user_role');
    }

    getUserProfile(): any {
        let user = this.userProfileSource.getValue() || this.getUserFromLocalStorage();
        if (user && !user.role) {
            user.role = 'customer';
        }
        return user;
    }

    private getUserFromLocalStorage(): any {
        try {
            const user = localStorage.getItem('user');
            return user ? JSON.parse(user) : null;
        } catch (error) {
            console.error("Error parsing user data from localStorage:", error);
            return null;
        }
    }

}
