import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../../User/user.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  profileForm!: FormGroup;
  submitted = false;
  showPassword = false;
  role: string = '';
  userProfile: any;
  imagePreview: string | ArrayBuffer | null = null;
  imageError: string = '';

  constructor(private fb: FormBuilder, private usersrc: UserService, private route: Router) {
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      zipCode: ['', [Validators.required]],
      mobNumber: ['', [Validators.required]],
      image: ['']
    });

    this.usersrc.userProfile$.subscribe(user => {
      if (user) {
        this.role = user.role || 'customer';
        this.profileForm.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          password: user.password,
          address: user.address,
          city: user.city,
          zipCode: user.zipCode,
          mobNumber: user.mobNumber,
          image: user.image
        });
      }
    });
  }


  get f() {
    return this.profileForm.controls;
  }

  updateProfile() {
    this.submitted = true;
    if (this.profileForm.invalid) {
      return;
    }

    const userProfile = this.usersrc.getUserProfile();
    if (!userProfile?.id) {
      console.error("User ID not found!");
      return;
    }

    const updatedData = {
      ...this.profileForm.value,
      role: userProfile.role
    };

    this.usersrc.updateUserProfile(userProfile.id, updatedData).subscribe(() => {
      Swal.fire({
        title: "Profile Updated! 🎉",
        text: "Your profile has been successfully updated.",
        icon: "success",
        customClass: {
          popup: "bg-gray-900 text-white rounded-xl shadow-lg border border-gray-700",
          title: "text-green-400 text-xl font-semibold",
          confirmButton: "bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg",
          htmlContainer: "text-gray-300 text-sm"
        },
        showConfirmButton: true,
        confirmButtonText: userProfile.role === 'admin' ? "Go to Dashboard" : "Back to Home Page",
        allowOutsideClick: false,
      }).then(() => {
        if (userProfile.role === 'admin') {
          this.route.navigate(['/admin']);
        } else {
          this.route.navigate(['/']);
        }
      });
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onImageSelected(event: any): void {
    const file = event.target.files[0];
    this.imageError = '';

    if (!file) return;

    const maxSizeMB = 5;
    const sizeInMB = file.size / (1024 * 1024);

    if (sizeInMB > maxSizeMB) {
      this.imageError = `Image size must not exceed ${maxSizeMB}MB.`;
      this.profileForm.get('image')?.setErrors({ invalidSize: true });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
      this.profileForm.patchValue({ image: reader.result });
      this.profileForm.get('image')?.updateValueAndValidity();
    };

    reader.readAsDataURL(file);
  }
}
