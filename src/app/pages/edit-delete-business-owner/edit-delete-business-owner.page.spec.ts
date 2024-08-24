import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditDeleteBusinessOwnerPage } from './edit-delete-business-owner.page';

describe('EditDeleteBusinessOwnerPage', () => {
  let component: EditDeleteBusinessOwnerPage;
  let fixture: ComponentFixture<EditDeleteBusinessOwnerPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDeleteBusinessOwnerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
