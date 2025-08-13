import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SigninComponent } from '../signin/signin.component';
import { LoginService } from '../../../State/Login/login.service';
import { Observable, map, catchError, of, delay } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent implements OnInit, OnDestroy {
  @Output() closeModalEvent = new EventEmitter<void>();
  RegisterForm: FormGroup;
  showPassword = false;
  submitted = false;
  imagePreview: string | ArrayBuffer | null = null;
  imageError: string = '';

  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<SigninComponent>, private dialog: MatDialog, private loginsrc: LoginService) {
    this.RegisterForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email], [this.emailExistsValidator.bind(this)]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      mobNumber: ['', [Validators.required], [this.mobileExistsValidator.bind(this)]],
      address: ['', Validators.required],
      city: ['', Validators.required],
      zipCode: ['', Validators.required],
      image: [''],
    });
  }

  ngOnInit() {
    document.body.style.overflow = 'hidden';
  }

  ngOnDestroy() {
    document.body.style.overflow = '';
  }

  closeModal() {
    this.dialogRef.close();
  }

  get f() {
    return this.RegisterForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    if (this.RegisterForm.invalid) {
      return;
    }

    console.log('Register request data:', this.RegisterForm.value);

    this.loginsrc.userRegister(this.RegisterForm.value).subscribe(
      (response) => {
        this.RegisterForm.reset();
        this.submitted = false;
        console.log('Form submitted successfully:', response);
        this.dialogRef.close({ success: true });
      },
      (error) => {
        console.log('Error during registration:', error);
        this.submitted = false;
        if (error.message === 'Email already exists') {
          this.RegisterForm.controls['email'].setErrors({ emailExists: true });
        }
        if (error.message === 'Mobile number already exists') {
          this.RegisterForm.controls['mobNumber'].setErrors({ mobileExists: true });
        }
      }
    );
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  openSigninModal() {
    this.dialog.closeAll();
    this.dialog.open(SigninComponent, {
      width: '400px',
    });
  }

  emailExistsValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    return this.checkIfEmailExists(control.value).pipe(
      map((exists) => (exists ? { emailExists: true } : null)),
      catchError(() => of(null))
    );
  }

  mobileExistsValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    return this.checkIfMobileExists(control.value).pipe(
      map((exists) => (exists ? { mobileExists: true } : null)),
      catchError(() => of(null))
    );
  }

  // Mock API Call (Replace with real API call)
  checkIfEmailExists(email: string): Observable<boolean> {
    const existingEmails = ['test@example.com', 'user@example.com']; // Mock database
    return of(existingEmails.includes(email)).pipe(delay(1000)); // Simulating API delay
  }

  checkIfMobileExists(mobile: string): Observable<boolean> {
    const existingMobiles = ['1234567890', '9876543210']; // Mock database
    return of(existingMobiles.includes(mobile)).pipe(delay(1000)); // Simulating API delay
  }

  onImageSelected(event: any): void {
    const file = event.target.files[0];
    this.imageError = '';

    if (!file) return;

    const maxSizeMB = 5;
    const sizeInMB = file.size / (1024 * 1024);

    if (sizeInMB > maxSizeMB) {
      this.imageError = `Image size must not exceed ${maxSizeMB}MB.`;
      this.RegisterForm.get('image')?.setErrors({ invalidSize: true });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
      this.RegisterForm.patchValue({ image: reader.result });
      this.RegisterForm.get('image')?.updateValueAndValidity();
    };

    reader.readAsDataURL(file);
  }
}