import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShowProductDetailsPage } from './show-product-details.page';

describe('ShowProductDetailsPage', () => {
  let component: ShowProductDetailsPage;
  let fixture: ComponentFixture<ShowProductDetailsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowProductDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
