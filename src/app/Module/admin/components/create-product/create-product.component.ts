import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AdminService } from '../../Admin/admin.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrl: './create-product.component.scss'
})
export class CreateProductComponent implements OnInit {
  productForm!: FormGroup;
  submitted = false;
  showPassword = false;
  menu: any[] = [];
  categories: any[] = [];
  subcategories: any[] = [];
  brands: any[] = [];
  editMode = false;
  editProductId: string | null = null;

  colors: string[] = [
    "Black", "Brown", "Blue", "Green", "Grey",
    "Gold", "Orange", "Purple", "Pink", "Red", "White",
    "Yellow"
  ];

  constructor(private fb: FormBuilder, private adminsrc: AdminService, private route: ActivatedRoute, private router: Router) {
    this.productForm = this.fb.group({
      menu: [''],
      category: [''],
      subcategory: [''],
      brand: [''],
      image: ['', [Validators.required]],
      title: ['', [Validators.required]],
      color: [''],
      details: ['', [Validators.required]],
      price: ['', [Validators.required]],
      disprice: ['', [Validators.required]],
      dispercent: [''],
    });

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.editMode = true;
        this.editProductId = id;
        this.getProductById(this.editProductId);
      }
    });

    this.getMenu();
    this.getCategory();
    this.getSubCategory();
    this.getBrand();
  }

  getProductById(id: string) {
    this.adminsrc.allProduct(`products/${id}`).subscribe((product) => {
      this.productForm.patchValue({
        menu: product.menuId,
        category: product.categoryId,
        subcategory: product.subcategoryId,
        brand: product.brandId,
        image: product.image,
        title: product.title,
        color: product.color,
        details: product.details,
        price: product.price,
        disprice: product.disprice,
        dispercent: product.dispercent,
      });
    });
  }

  ngOnInit(): void {
    this.productForm.get('price')?.valueChanges.subscribe(() => {
      this.calculateDiscountPercentage();
    });

    this.productForm.get('disprice')?.valueChanges.subscribe(() => {
      this.calculateDiscountPercentage();
    });
  }

  calculateDiscountPercentage() {
    const price = parseFloat(this.productForm.get('price')?.value) || 0;
    const disprice = parseFloat(this.productForm.get('disprice')?.value) || 0;

    if (price > 0 && disprice > 0 && disprice < price) {
      const discount = ((price - disprice) / price) * 100;
      const roundedDiscount = discount % 1 >= 0.5 ? Math.ceil(discount) : Math.floor(discount);
      this.productForm.patchValue({ dispercent: roundedDiscount });
    } else {
      this.productForm.patchValue({ dispercent: '' });
    }
  }

  get f() {
    return this.productForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.productForm.invalid) {
      return;
    }

    const selectedMenu = this.menu.find(m => m.id === this.productForm.value.menu);
    const selectedCategory = this.categories.find(c => c.id === this.productForm.value.category);
    const selectedSubcategory = this.subcategories.find(s => s.id === this.productForm.value.subcategory);
    const selectedBrand = this.brands.find(b => b.id === this.productForm.value.brand);

    if (!selectedMenu && !selectedCategory && !selectedSubcategory && !selectedBrand) return;

    const productData = {
      menuId: selectedMenu.id,
      categoryId: selectedCategory.id,
      subcategoryId: selectedSubcategory.id,
      brandId: selectedBrand.id,
      image: this.productForm.value.image,
      title: this.productForm.value.title,
      color: this.productForm.value.color,
      details: this.productForm.value.details,
      price: Number(this.productForm.value.price),
      disprice: Number(this.productForm.value.disprice),
      dispercent: Number(this.productForm.value.dispercent)
    };

    if (this.editMode) {
      this.adminsrc.updateProduct(this.editProductId!, productData).subscribe(() => {
        Swal.fire({
          title: 'Product Updated Successfully! ✅',
          text: 'Your product item has been updated.',
          icon: 'success',
          customClass: {
            popup: 'bg-gray-900 text-white rounded-xl shadow-lg border border-gray-700',
            title: 'text-green-400 text-xl font-semibold',
            confirmButton: 'bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg',
            htmlContainer: 'text-gray-300 text-sm',
          },
          confirmButtonText: 'OK',
        });

        this.router.navigate(['/admin/product']);
      });
    } else {
      this.adminsrc.addProduct('products', productData).subscribe(() => {
        Swal.fire({
          title: 'Product Added Successfully! ✅',
          text: 'Your new product item has been saved.',
          icon: 'success',
          customClass: {
            popup: 'bg-gray-900 text-white rounded-xl shadow-lg border border-gray-700',
            title: 'text-green-400 text-xl font-semibold',
            confirmButton: 'bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg',
            htmlContainer: 'text-gray-300 text-sm',
          },
          confirmButtonText: 'OK',
        });

        this.productForm.reset();
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

  getSubCategory() {
    this.adminsrc.getsubCategories('subcategories').subscribe({
      next: (data) => {
        this.subcategories = data;
        console.log('subcategories Data:', this.subcategories);
      },
      error: (err) => {
        console.error('Error fetching menu:', err);
      }
    });
  }

  getBrand() {
    this.adminsrc.getbrands('brands').subscribe({
      next: (data) => {
        this.brands = data;
        console.log('brands Data:', this.brands);
      },
      error: (err) => {
        console.error('Error fetching menu:', err);
      }
    });
  }

  onMenuChange(event: any) {
    const menuId = event.target.value;
    if (menuId) {
      this.getCategoriesByMenuId(menuId);
      this.getBrandsByMenuId(menuId);
      this.subcategories = []; // Reset subcategories when menu changes
      this.brands = []; // Reset brands when menu changes
    } else {
      this.categories = []; // Reset categories if no menu is selected
      this.subcategories = []; // Reset subcategories
    }
  }

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

  getBrandsByMenuId(menuId: string) {
    this.adminsrc.getBrandByMenuId(menuId).subscribe({
      next: (data) => {
        this.brands = data;
        console.log('brands Data:', this.brands);
      },
      error: (err) => {
        console.error('Error fetching brands:', err);
      }
    });
  }

  onCategoryChange(event: any) {
    const categoryId = event.target.value;
    if (categoryId) {
      this.getSubCategoriesByCategoryId(categoryId);
    } else {
      this.subcategories = []; // Reset subcategories if no category is selected
    }
  }

  getSubCategoriesByCategoryId(categoryId: string) {
    this.adminsrc.getSubCategoriesByCategoryId(categoryId).subscribe({
      next: (data) => {
        this.subcategories = data;
        console.log('Subcategories Data:', this.subcategories);
      },
      error: (err) => {
        console.error('Error fetching subcategories:', err);
      }
    });
  }
}
