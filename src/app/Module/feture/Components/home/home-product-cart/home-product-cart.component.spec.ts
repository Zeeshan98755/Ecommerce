import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeProductCartComponent } from './home-product-cart.component';

describe('HomeProductCartComponent', () => {
  let component: HomeProductCartComponent;
  let fixture: ComponentFixture<HomeProductCartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeProductCartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeProductCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
