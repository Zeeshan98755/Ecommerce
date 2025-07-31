import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AdminService } from '../../Admin/admin.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-subcategory',
  templateUrl: './subcategory.component.html',
  styleUrl: './subcategory.component.scss'
})
export class SubcategoryComponent {
  subcategoryForm!: FormGroup;
  submitted = false;
  menu: any[] = [];
  categories: any[] = [];
  editMode = false;
  editsubCategoryId: string | null = null;

  constructor(private fb: FormBuilder, private adminsrc: AdminService, private route: ActivatedRoute, private router: Router) {
    this.subcategoryForm = this.fb.group({
      menu: ['', Validators.required],
      category: ['', Validators.required],
      name: ['', [Validators.required]]
    });

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.editMode = true;
        this.editsubCategoryId = id; // Store string ID
        this.getsubCategoryById(this.editsubCategoryId);
      }
    });

    this.getMenu();
    this.getCategory();
  }

  getsubCategoryById(id: string) {
    this.adminsrc.getsubCategories(`subcategories/${id}`).subscribe((subcategory) => {
      this.subcategoryForm.patchValue({
        menu: subcategory.menuId,
        category: subcategory.categoryId,
        name: subcategory.name,
      });
    });
  }

  get f() {
    return this.subcategoryForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.subcategoryForm.invalid) {
      return;
    }

    const selectedMenu = this.menu.find(m => m.id === this.subcategoryForm.value.menu);
    const selectedCategory = this.categories.find(c => c.id === this.subcategoryForm.value.category);
    if (!selectedMenu && !selectedCategory) return;

    const subcategoryData = {
      menuId: selectedMenu.id,
      categoryId: selectedCategory.id,
      categoryName: selectedCategory.name,
      name: this.subcategoryForm.value.name
    };

    if (this.editMode) {
      this.adminsrc.updatesubCategory(this.editsubCategoryId!, subcategoryData).subscribe(() => {
        Swal.fire({
          title: 'Sub Category Updated Successfully! ✅',
          text: 'Your sub category item has been updated.',
          icon: 'success',
          customClass: {
            popup: 'bg-gray-900 text-white rounded-xl shadow-lg border border-gray-700',
            title: 'text-green-400 text-xl font-semibold',
            confirmButton: 'bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg',
            htmlContainer: 'text-gray-300 text-sm',
          },
          confirmButtonText: 'OK',
        });

        this.router.navigate(['/admin/sub_category']);
      });
    } else {
      this.adminsrc.addCategory('subcategories', subcategoryData).subscribe(() => {
        Swal.fire({
          title: 'Sub Category Added Successfully! ✅',
          text: 'Your new sub category item has been saved.',
          icon: 'success',
          customClass: {
            popup: 'bg-gray-900 text-white rounded-xl shadow-lg border border-gray-700',
            title: 'text-green-400 text-xl font-semibold',
            confirmButton: 'bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg',
            htmlContainer: 'text-gray-300 text-sm',
          },
          confirmButtonText: 'OK',
        });

        this.subcategoryForm.reset();
        this.submitted = false;
      });
    }
  }

  getMenu() {
    this.adminsrc.getmenu('menu').subscribe({
      next: (data) => {
        this.menu = data;
        console.log('menu Data:', this.menu);
      },
      error: (err) => {
        console.error('Error fetching menu:', err);
      }
    });
  }

  getCategory() {
    this.adminsrc.getCategories('categories').subscribe({
      next: (data) => {
        this.categories = data;
        console.log('categories Data:', this.categories);
      },
      error: (err) => {
        console.error('Error fetching menu:', err);
      }
    });
  }

  onMenuChange(event: any) {
    const menuId = event.target.value;
    if (menuId) {
      this.getCategoriesByMenuId(menuId); // Fetch categories for the selected menu
    } else {
      this.categories = []; // Reset categories if no menu is selected
    }
  }

  // Fetch categories by menuId
  getCategoriesByMenuId(menuId: string) {
    this.adminsrc.getCategoriesByMenuId(menuId).subscribe({
      next: (data) => {
        this.categories = data;
        console.log('Categories Data:', this.categories);
      },
      error: (err) => {
        console.error('Error fetching categories:', err);
      }
    });
  }
}
