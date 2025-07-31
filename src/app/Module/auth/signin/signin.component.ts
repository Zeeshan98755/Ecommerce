import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SignupComponent } from '../signup/signup.component';
import { LoginService } from '../../../State/Login/login.service';
import { UserService } from '../../../User/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss'
})
export class SigninComponent {
  @Output() closeModalEvent = new EventEmitter<void>();

  loginForm: FormGroup;
  showPassword = false;
  submitted = false;
  userProfile: any;

  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<SigninComponent>, private dialog: MatDialog, private loginsrc: LoginService, private usersrc: UserService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  closeModal() {
    this.dialogRef.close();
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    console.log('Login Request Data:', this.loginForm.value);

    const { email, password } = this.loginForm.value;
    this.loginsrc.authLogin(email, password).subscribe(
      (response) => {
        console.log('Login successful:', response);

        localStorage.setItem('role', response.role);

        this.usersrc.setUserProfile(response);

        if (response.role === 'admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/']);
        }

        this.dialogRef.close({ success: true });

        this.loginForm.reset();
        this.submitted = false;
      },
      (error) => {
        console.error('Login failed:', error.message);
        alert(error.message);
        this.submitted = false;
      }
    );
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  openSignupModal() {
    this.dialog.closeAll();
    this.dialog.open(SignupComponent, {
      width: '400px',
    });
  }
}