import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AdminService } from '../../Admin/admin.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-brands',
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.scss'
})
export class BrandsComponent {
  brandForm!: FormGroup;
  submitted = false;
  menu: any[] = [];
  editMode = false;
  editBrandId: string | null = null;

  constructor(private fb: FormBuilder, private adminsrc: AdminService, private route: ActivatedRoute, private router: Router) {
    this.brandForm = this.fb.group({
      menu: ['', [Validators.required]],
      name: ['', [Validators.required]]
    });

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.editMode = true;
        this.editBrandId = id; // Store string ID
        this.getBrandById(this.editBrandId);
      }
    });

    this.getMenu();
  }

  getBrandById(id: string) {
    this.adminsrc.getCategories(`brands/${id}`).subscribe((brand) => {
      this.brandForm.patchValue({
        menu: brand.menuId,
        name: brand.name,
      });
    });
  }

  get f() {
    return this.brandForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.brandForm.invalid) {
      return;
    }

    const selectedMenu = this.menu.find(m => m.id === this.brandForm.value.menu);
    if (!selectedMenu) return;

    const BrandData = {
      menuId: selectedMenu.id,
      menuName: selectedMenu.name,
      name: this.brandForm.value.name
    };

    if (this.editMode) {
      this.adminsrc.updateBrand(this.editBrandId!, BrandData).subscribe(() => {
        Swal.fire({
          title: 'Brand Updated Successfully! ✅',
          text: 'Your brand item has been updated.',
          icon: 'success',
          customClass: {
            popup: 'bg-gray-900 text-white rounded-xl shadow-lg border border-gray-700',
            title: 'text-green-400 text-xl font-semibold',
            confirmButton: 'bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg',
            htmlContainer: 'text-gray-300 text-sm',
          },
          confirmButtonText: 'OK',
        });

        this.router.navigate(['/admin/brand']);
      });
    } else {
      this.adminsrc.addbrand('brands', BrandData).subscribe(() => {
        Swal.fire({
          title: 'Brand Added Successfully! ✅',
          text: 'Your new brand item has been saved.',
          icon: 'success',
          customClass: {
            popup: 'bg-gray-900 text-white rounded-xl shadow-lg border border-gray-700',
            title: 'text-green-400 text-xl font-semibold',
            confirmButton: 'bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg',
            htmlContainer: 'text-gray-300 text-sm',
          },
          confirmButtonText: 'OK',
        });

        this.brandForm.reset();
        this.submitted = false;
      });
    }
  }

  getMenu() {
    this.adminsrc.getmenu('menu').subscribe({
      next: (data) => {
        this.menu = data;
        console.log('Menu Data:', this.menu);
      },
      error: (err) => {
        console.error('Error fetching menu:', err);
      }
    });
  }
}
