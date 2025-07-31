import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SigninComponent } from '../../../auth/signin/signin.component';
import { UserService } from '../../../../User/user.service';
import { AdminService } from '../../../admin/Admin/admin.service';
import { CartService } from '../../../../State/Cart/cart.service';
import { ProductService } from '../../../../State/Product/product.service';
import { OrderService } from '../../../../State/Order/order.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  userData: any;
  constructor(private route: Router, private dialog: MatDialog, private usersrc: UserService, private adminsrc: AdminService, private cartsrc: CartService, private prosrc: ProductService, private ordersrc: OrderService) { }
  isNavbarContentOpen: boolean = false;
  currentSection: any;
  showModal = false;
  userProfile: any;
  user_role!: any;
  private scrollPosition = 0;
  menu: any[] = [];
  cartCount: number = 0;
  isMobileMenuOpen: boolean = false;
  @ViewChild('navbarContent') navbarContent!: ElementRef;

  ngOnInit(): void {
    this.userProfile = this.usersrc.getUserProfile();
    this.user_role = this.userProfile?.role || 'customer';

    this.usersrc.userProfile$.subscribe((userProfile) => {
      this.userProfile = userProfile;
      this.user_role = userProfile?.role || 'customer';
    });

    this.adminsrc.getmenu('menu').subscribe((data) => {
      this.menu = data;
    });
    this.cartsrc.getCartCount().subscribe(count => {
      this.cartCount = count;
    });

    this.route.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isNavbarContentOpen = false;
        this.isMobileMenuOpen = false;
        document.body.classList.remove('no-scroll');
      }
    });
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  handleOrderSuccess() {
    this.cartsrc.clearCart(this.userData.id);
    this.cartCount = 0;
  }

  openNavbarContent(section: any) {
    console.log('Clicked section ID:', section);

    this.isNavbarContentOpen = false;
    setTimeout(() => {
      this.currentSection = section;
      this.isNavbarContentOpen = true;
      document.body.classList.add('no-scroll');
    }, 0);
  }

  closeNavbarContent() {
    this.isNavbarContentOpen = false;
    setTimeout(() => {
      document.body.classList.remove('no-scroll');
    }, 300);
  }


  @HostListener('document:click', [`$event`])
  onDocumentClick(event: MouseEvent) {
    if (this.navbarContent && this.navbarContent.nativeElement.contains(event.target)) {
      return;
    }

    const openButtons = document.querySelectorAll('.open-button');
    let clickInsideButton = Array.from(openButtons).some((button) =>
      button.contains(event.target as Node)
    );

    if (!clickInsideButton && this.isNavbarContentOpen) {
      this.closeNavbarContent();
    }
  }

  handleOpenLoginModal() {
    this.showModal = true;
    this.openModal();
  }

  openModal() {
    this.scrollPosition = window.scrollY;

    const dialogRef = this.dialog.open(SigninComponent, {
      width: '400px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(() => {
      this.showModal = false;
      window.scrollTo(0, this.scrollPosition);
    });
  }

  navigateTo(path: any) {
    const isLoggedIn = localStorage.getItem('user');
    if (!isLoggedIn) {
      Swal.fire({
        title: 'Login Required ❗',
        text: 'Please login first to access the cart!',
        icon: 'warning',
        customClass: {
          popup: 'bg-gray-900 text-white rounded-xl shadow-lg border border-gray-700',
          title: 'text-yellow-400 text-xl font-semibold',
          confirmButton: 'bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg',
          htmlContainer: 'text-gray-300 text-sm',
        },
        confirmButtonText: 'Login',
      }).then((result) => {
        if (result.isConfirmed) {
          this.route.navigate(['/login']);
        }
      });
    } else {
      this.route.navigate([path]);
    }
  }

  handleLogout(): void {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out of your account.",
      icon: "warning",
      customClass: {
        popup: "bg-gray-900 text-white rounded-xl shadow-lg border border-gray-700",
        title: "text-[#f8bb86] text-xl font-semibold",
        confirmButton: "bg-[#f8bb86] hover:bg-[#f8bb86] text-white px-6 py-2 rounded-lg",
        htmlContainer: "text-gray-300 text-sm"
      },
      showConfirmButton: true,
      confirmButtonText: "Ok",
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        const storedUser = localStorage.getItem('user');
        const userId = storedUser ? JSON.parse(storedUser).id : null;
        this.usersrc.clearUserProfile();
        this.usersrc.logout();
        localStorage.removeItem('user');
        localStorage.removeItem('cart');
        localStorage.removeItem('userId');
        localStorage.removeItem('orders');
        localStorage.clear();

        if (userId) {
          this.cartsrc.clearCart(userId);
        }

        this.ordersrc.clearOrders();
        this.prosrc.clearProducts();

        this.usersrc.userProfileSource.next(null);

        this.route.navigate(['/']).then(() => {
          window.location.reload();
        });
      }
    });
  }
}
