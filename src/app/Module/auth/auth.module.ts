import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { AuthComponent } from './auth.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    SigninComponent,
    SignupComponent,
    AuthComponent
  ],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    NzFormModule,
    FormsModule,
    MatButtonModule,
    ReactiveFormsModule,
    NzInputModule
  ],
  exports: [
    SigninComponent,
    SignupComponent,
    AuthComponent
  ]
})
export class AuthModule { }
