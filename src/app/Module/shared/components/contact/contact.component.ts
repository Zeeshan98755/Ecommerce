import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2'
import { IntlTelInputDirective } from '../../../../directives/intl-tel-input.directive';
import { LoaderService } from '../../../../State/Loader/loader.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent implements OnInit {
  @ViewChild(IntlTelInputDirective, { static: false })
  phoneInputDirective!: IntlTelInputDirective;
  contactForm!: FormGroup;
  submitted = false;
  selectedCountry: string = '';
  contactLength: number = 0;

  constructor(private fb: FormBuilder, private loaderService: LoaderService) { }

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      number: ['', Validators.required],
      subject: ['', Validators.required],
      message: ['', Validators.required]
    });

    this.loaderService.show();

    setTimeout(() => {
      this.loaderService.hide();
    }, 1500);
  }

  get f() {
    return this.contactForm.controls;
  }

  handleSubmit() {
    this.submitted = true;

    if (this.contactForm.invalid) {
      console.error('Form is invalid');
      return;
    }

    Swal.fire({
      title: 'Message Sent! ✅',
      text: 'Your message has been sent successfully.',
      icon: 'success',
      customClass: {
        popup: 'bg-gray-900 text-white rounded-xl shadow-lg border border-gray-700',
        title: 'text-green-400 text-xl font-semibold',
        confirmButton: 'bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg',
        htmlContainer: 'text-gray-300 text-sm',
      },
      confirmButtonText: 'OK',
    });

    this.contactForm.reset();
    this.submitted = false;
  }

  onCountryChange() {
    const numberLength = this.phoneInputDirective.getNumberLength();
    this.contactLength = numberLength.countryNumberLength;
    const phoneNumberControl = this.contactForm.get('number');
    if (phoneNumberControl) {
      phoneNumberControl.setValidators([
        Validators.required,
        Validators.minLength(this.contactLength),
        Validators.maxLength(this.contactLength)
      ]);
      phoneNumberControl.updateValueAndValidity();
    }
    this.selectedCountry = numberLength.exampleNumber;
    console.log('Phone number length:', this.contactLength);
  }
}
