import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../../State/Product/product.service';
import { CartService } from '../../../../State/Cart/cart.service';
import Swal from 'sweetalert2';
import { LoginService } from '../../../../State/Login/login.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
  selectedSize: any;
  allReviews = [
    { id: 'a1', user: 'John', rating: 4, comment: 'Nice product' },
    { id: 'b2', user: 'Doe', rating: 5, comment: 'Excellent!' },
    { id: 'c3', user: 'Alice', rating: 3, comment: 'Good but can be better' },
    { id: 'd4', user: 'Sath', rating: 1, comment: 'Not Good' },
    { id: 'e5', user: 'Align', rating: 4, comment: 'Nice product' },
    { id: 'f6', user: 'Devian', rating: 2, comment: 'Not Bad' }
  ];
  reviews: any[] = [];
  relatedProduct: any[] = [];
  currentIndex = 0;
  interval: any;
  product: any;
  productId: any;
  @ViewChild('imageElement') imageElement!: ElementRef;
  @ViewChild('zoomLens') zoomLens!: ElementRef;
  totalRatings = 0;
  ratingDistribution = {
    excellent: 0,
    veryGood: 0,
    good: 0,
    average: 0,
    poor: 0
  };

  constructor(private route: ActivatedRoute, private prosrc: ProductService, private router: Router, private cartsrc: CartService, private loginsrc: LoginService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.productId = params.get('id');
      if (this.productId) {
        this.loadRatings();
        this.getProductDetails(this.productId);
      }
    });
    this.interval = setInterval(() => {
      this.nextSlide();
    }, 3000);
    this.shuffleReviews();
  }

  shuffleReviews() {
    const shuffled = [...this.allReviews].sort(() => 0.5 - Math.random());
    this.reviews = shuffled.slice(0, 3).map(review => ({
      ...review,
      date: this.getRandomDate()
    }));
  }

  getRandomDate(): string {
    const today = new Date();
    const pastDays = Math.floor(Math.random() * 30) + 1;
    const randomDate = new Date(today);
    randomDate.setDate(today.getDate() - pastDays);

    return randomDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }

  loadRatings() {
    const savedRatings = localStorage.getItem('product-star-ratings');
    if (savedRatings) {
      const ratingsArray = JSON.parse(savedRatings);
      this.totalRatings = ratingsArray.length;

      this.ratingDistribution = {
        excellent: ratingsArray.filter((r: number) => r === 5).length,
        veryGood: ratingsArray.filter((r: number) => r === 4).length,
        good: ratingsArray.filter((r: number) => r === 3).length,
        average: ratingsArray.filter((r: number) => r === 2).length,
        poor: ratingsArray.filter((r: number) => r === 1).length,
      };
    }
  }

  updateTotalRatings(count: number) {
    this.totalRatings = count;
  }

  updateRatingDistribution(distribution: any) {
    this.ratingDistribution = distribution;
  }

  getProductDetails(id: string) {
    this.prosrc.findProductById(`products`, id).subscribe(
      (data) => {
        this.product = data;
        console.log("Product Details:", this.product);
        this.getRelatedProducts(this.product.menuId, this.product.categoryId, this.product.subcategoryId, this.product.brandId, this.product.id);
      },
      (error) => {
        console.error("Error fetching product details:", error);
      }
    );
  }

  getRelatedProducts(menuId: string, categoryId: string, subcategoryId: string, brandId: string, productId: string) {
    this.prosrc.getProducts('products').subscribe(
      (data) => {
        console.log("All Products:", data);

        this.relatedProduct = data.filter((item: any) =>
          item.menuId === menuId &&
        item.categoryId === categoryId &&
        item.subcategoryId === subcategoryId &&
          item.brandId === brandId &&
          item.id !== productId
        );

        console.log("Menu ID:", menuId);
        console.log("Category ID:", categoryId);
        console.log("SubCategory ID:", subcategoryId);
        console.log("Brand ID:", brandId);
        console.log("Excluded Product ID:", productId);
        console.log("Filtered Related Products:", this.relatedProduct);
      },
      (error) => {
        console.error("Error fetching related products:", error);
      }
    );
  }

  prevSlide() {
    const totalSlides = this.relatedProduct?.length || 0;
    const newIndex = (this.currentIndex - 1 + totalSlides) % (totalSlides || 1);
    this.currentIndex = newIndex > totalSlides / 4 ? 0 : newIndex;
  }

  nextSlide() {
    const totalSlides = this.relatedProduct?.length || 0;
    const newIndex = (this.currentIndex + 1) % (totalSlides || 1);
    this.currentIndex = newIndex > totalSlides / 4 ? 0 : newIndex;
  }

  handleAddToCart() {
    if (!this.loginsrc.isLoggedIn()) {
      Swal.fire({
        title: 'Login Required ❗',
        text: 'Please login first to add items to your cart.',
        icon: 'warning',
        customClass: {
          popup: 'bg-gray-900 text-white rounded-xl shadow-lg border border-gray-700',
          title: 'text-yellow-400 text-xl font-semibold',
          confirmButton: 'bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg',
          htmlContainer: 'text-gray-300 text-sm',
        },
        confirmButtonText: 'Login',
      }).then(() => {
        this.router.navigate(['login']);
      });
      return;
    }

    const cartItem = {
      productId: this.product.id,
      menuId: this.product.menuId,
      categoryId: this.product.categoryId,
      subcategoryId: this.product.subcategoryId,
      brandId: this.product.brandId,
      image: this.product.image,
      title: this.product.title,
      color: this.product.color,
      price: this.product.price,
      disprice: this.product.disprice,
      dispercent: this.product.dispercent,
      quantity: 1,
      userId: this.loginsrc.getUserId(),
    };

    this.cartsrc.addToCart(cartItem)?.subscribe(() => {
      Swal.fire({
        title: 'Added to Cart! 🛒',
        text: `${this.product.title} has been added to your cart.`,
        icon: 'success',
        customClass: {
          popup: 'bg-gray-900 text-white rounded-xl shadow-lg border border-gray-700',
          title: 'text-green-400 text-xl font-semibold',
          confirmButton: 'bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg',
          htmlContainer: 'text-gray-300 text-sm',
        },
        confirmButtonText: 'OK',
      }).then(() => {
        this.router.navigate(['cart']);
      });
    });
  }

  getColorClass(color: string): string {
    const colorClasses: { [key: string]: string } = {
      'White': 'text-white border-gray-300 bg-gray-100 shadow text-gray-900',
      'Black': 'text-black border-gray-800 bg-gray-900 shadow-lg text-white',
      'Red': 'text-red-500 border-red-500 bg-red-100 shadow-red-500/50',
      'Purple': 'text-purple-500 border-purple-500 bg-purple-100 shadow-purple-500/50',
      'Brown': 'text-amber-700 border-amber-700 bg-amber-100 shadow-amber-700/50',
      'Pink': 'text-pink-500 border-pink-500 bg-pink-100 shadow-pink-500/50',
      'Green': 'text-green-500 border-green-500 bg-green-100 shadow-green-500/50',
      'Yellow': 'text-yellow-500 border-yellow-500 bg-yellow-100 shadow-yellow-500/50',
      'Blue': 'text-blue-500 border-blue-500 bg-blue-100 shadow-blue-500/50',
      'Grey': 'text-gray-500 border-gray-500 bg-gray-100 shadow-gray-500/50',
      'Orange': 'text-orange-500 border-orange-500 bg-orange-100 shadow-orange-500/50',
      'Gold': 'text-yellow-400 border-yellow-400 bg-yellow-100 shadow-yellow-400/50'
    };

    return colorClasses[color] || 'text-white border-gray-300 bg-gray-100 shadow';
  }

  zoomImage(event: MouseEvent) {
    const img = this.imageElement.nativeElement as HTMLImageElement;
    const lens = this.zoomLens.nativeElement as HTMLDivElement;

    lens.style.display = 'block';
    lens.style.backgroundImage = `url(${img.src})`;

    const rect = img.getBoundingClientRect();
    const x = event.clientX - rect.left - lens.offsetWidth / 2;
    const y = event.clientY - rect.top - lens.offsetHeight / 2;

    lens.style.left = `${x}px`;
    lens.style.top = `${y}px`;
    lens.style.backgroundPosition = `-${x * 2}px -${y * 2}px`;
  }

  resetZoom() {
    this.zoomLens.nativeElement.style.display = 'none';
  }

}
