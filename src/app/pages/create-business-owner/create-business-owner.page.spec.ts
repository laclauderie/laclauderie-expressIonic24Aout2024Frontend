import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateBusinessOwnerPage } from './create-business-owner.page';

describe('CreateBusinessOwnerPage', () => {
  let component: CreateBusinessOwnerPage;
  let fixture: ComponentFixture<CreateBusinessOwnerPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateBusinessOwnerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
