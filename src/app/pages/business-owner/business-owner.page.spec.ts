import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BusinessOwnerPage } from './business-owner.page';

describe('BusinessOwnerPage', () => {
  let component: BusinessOwnerPage;
  let fixture: ComponentFixture<BusinessOwnerPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessOwnerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
