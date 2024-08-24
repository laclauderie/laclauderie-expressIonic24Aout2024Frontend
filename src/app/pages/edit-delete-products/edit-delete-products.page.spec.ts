import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditDeleteProductsPage } from './edit-delete-products.page';

describe('EditDeleteProductsPage', () => {
  let component: EditDeleteProductsPage;
  let fixture: ComponentFixture<EditDeleteProductsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDeleteProductsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
