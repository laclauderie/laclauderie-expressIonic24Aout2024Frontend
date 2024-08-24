import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateCategoriesPage } from './create-categories.page';

describe('CreateCategoriesPage', () => {
  let component: CreateCategoriesPage;
  let fixture: ComponentFixture<CreateCategoriesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCategoriesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
