import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditDeleteDetailsPage } from './edit-delete-details.page';

describe('EditDeleteDetailsPage', () => {
  let component: EditDeleteDetailsPage;
  let fixture: ComponentFixture<EditDeleteDetailsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDeleteDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
