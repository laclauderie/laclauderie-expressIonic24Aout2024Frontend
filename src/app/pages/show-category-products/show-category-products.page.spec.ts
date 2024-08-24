import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShowCategoryProductsPage } from './show-category-products.page';

describe('ShowCategoryProductsPage', () => {
  let component: ShowCategoryProductsPage;
  let fixture: ComponentFixture<ShowCategoryProductsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowCategoryProductsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
