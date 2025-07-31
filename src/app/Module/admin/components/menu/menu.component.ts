import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AdminService } from '../../Admin/admin.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  menuForm!: FormGroup;
  submitted = false;
  menu: any[] = [];
  editMode = false;
  editMenuId: string | null = null;

  constructor(private fb: FormBuilder, private adminsrc: AdminService, private route: ActivatedRoute, private router: Router) {
    this.menuForm = this.fb.group({
      name: ['', [Validators.required]]
    });

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.editMode = true;
        this.editMenuId = id; // Store string ID
        this.getMenuById(this.editMenuId);
      }
    });
  }

  getMenuById(id: string) {
    this.adminsrc.getmenu(`menu/${id}`).subscribe((menu) => {
      this.menuForm.patchValue({
        name: menu.name,
      });
    });
  }

  get f() {
    return this.menuForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.menuForm.invalid) {
      return;
    }

    if (this.editMode) {
      this.adminsrc.updateMenu(this.editMenuId!, this.menuForm.value).subscribe(() => {
        Swal.fire({
          title: 'Menu Updated Successfully! ✅',
          text: 'Your menu item has been updated.',
          icon: 'success',
          customClass: {
            popup: 'bg-gray-900 text-white rounded-xl shadow-lg border border-gray-700',
            title: 'text-green-400 text-xl font-semibold',
            confirmButton: 'bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg',
            htmlContainer: 'text-gray-300 text-sm',
          },
          confirmButtonText: 'OK',
        });

        this.router.navigate(['/admin/menu']);
      });
    } else {
      this.adminsrc.addMenu('menu', this.menuForm.value).subscribe(() => {
        Swal.fire({
          title: 'Menu Added Successfully! ✅',
          text: 'Your new menu item has been saved.',
          icon: 'success',
          customClass: {
            popup: 'bg-gray-900 text-white rounded-xl shadow-lg border border-gray-700',
            title: 'text-green-400 text-xl font-semibold',
            confirmButton: 'bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg',
            htmlContainer: 'text-gray-300 text-sm',
          },
          confirmButtonText: 'OK',
        });

        this.menuForm.reset();
        this.submitted = false;
      });
    }
  }
}
