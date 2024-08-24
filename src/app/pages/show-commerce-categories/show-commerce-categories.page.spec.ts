import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShowCommerceCategoriesPage } from './show-commerce-categories.page';

describe('ShowCommerceCategoriesPage', () => {
  let component: ShowCommerceCategoriesPage;
  let fixture: ComponentFixture<ShowCommerceCategoriesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowCommerceCategoriesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
