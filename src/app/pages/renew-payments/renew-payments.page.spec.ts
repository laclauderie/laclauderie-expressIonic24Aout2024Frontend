import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RenewPaymentsPage } from './renew-payments.page';

describe('RenewPaymentsPage', () => {
  let component: RenewPaymentsPage;
  let fixture: ComponentFixture<RenewPaymentsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RenewPaymentsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
