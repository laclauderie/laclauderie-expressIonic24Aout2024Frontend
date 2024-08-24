import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditDeleteCategoriesPage } from './edit-delete-categories.page';

describe('EditDeleteCategoriesPage', () => {
  let component: EditDeleteCategoriesPage;
  let fixture: ComponentFixture<EditDeleteCategoriesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDeleteCategoriesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
