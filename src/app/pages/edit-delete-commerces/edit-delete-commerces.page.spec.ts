import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditDeleteCommercesPage } from './edit-delete-commerces.page';

describe('EditDeleteCommercesPage', () => {
  let component: EditDeleteCommercesPage;
  let fixture: ComponentFixture<EditDeleteCommercesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDeleteCommercesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
