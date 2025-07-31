import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../../Admin/admin.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})
export class CategoryComponent {
  categoryForm!: FormGroup;
  submitted = false;
  menu: any[] = [];
  editMode = false;
  editCategoryId: string | null = null;

  constructor(private fb: FormBuilder, private adminsrc: AdminService, private route: ActivatedRoute, private router: Router) {
    this.categoryForm = this.fb.group({
      menu: ['', Validators.required],
      name: ['', [Validators.required]]
    });

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.editMode = true;
        this.editCategoryId = id; // Store string ID
        this.getCategoryById(this.editCategoryId);
      }
    });

    this.getMenu();
  }

  getCategoryById(id: string) {
    this.adminsrc.getCategories(`categories/${id}`).subscribe((category) => {
      this.categoryForm.patchValue({
        menu: category.menuId,
        name: category.name,
      });
    });
  }

  get f() {
    return this.categoryForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.categoryForm.invalid) {
      return;
    }

    const selectedMenu = this.menu.find(m => m.id === this.categoryForm.value.menu);
    if (!selectedMenu) return;

    const categoryData = {
      menuId: selectedMenu.id,
      menuName: selectedMenu.name,
      name: this.categoryForm.value.name
    };

    if (this.editMode) {
      this.adminsrc.updateCategory(this.editCategoryId!, categoryData).subscribe(() => {
        Swal.fire({
          title: 'Category Updated Successfully! ✅',
          text: 'Your category item has been updated.',
          icon: 'success',
          customClass: {
            popup: 'bg-gray-900 text-white rounded-xl shadow-lg border border-gray-700',
            title: 'text-green-400 text-xl font-semibold',
            confirmButton: 'bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg',
            htmlContainer: 'text-gray-300 text-sm',
          },
          confirmButtonText: 'OK',
        });

        this.router.navigate(['/admin/category']);
      });
    } else {
      this.adminsrc.addCategory('categories', categoryData).subscribe(() => {
        Swal.fire({
          title: 'Category Added Successfully! ✅',
          text: 'Your new category item has been saved.',
          icon: 'success',
          customClass: {
            popup: 'bg-gray-900 text-white rounded-xl shadow-lg border border-gray-700',
            title: 'text-green-400 text-xl font-semibold',
            confirmButton: 'bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg',
            htmlContainer: 'text-gray-300 text-sm',
          },
          confirmButtonText: 'OK',
        });

        this.categoryForm.reset();
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
