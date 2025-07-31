import { Component, OnInit } from '@angular/core';
import { UserService } from './User/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private usersrc: UserService) { }

  ngOnInit(): void {
    const storedUser = localStorage.getItem("jwt");

    if (storedUser) {
      const user = this.decodeJWT(storedUser);
      if (user?.id) {
        this.usersrc.fetchUserProfile(user.id).subscribe({
          next: (userProfile) => {
            console.log("User profile loaded:", userProfile);
          },
          error: (error) => {
            console.error("Error fetching user profile:", error);
          }
        });
      }
    }
  }

  private decodeJWT(token: string): any {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      console.error("Invalid JWT token", e);
      return null;
    }
  }
}
