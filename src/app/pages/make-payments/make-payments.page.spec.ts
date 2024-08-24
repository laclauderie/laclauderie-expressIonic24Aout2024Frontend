import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MakePaymentsPage } from './make-payments.page';

describe('MakePaymentsPage', () => {
  let component: MakePaymentsPage;
  let fixture: ComponentFixture<MakePaymentsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MakePaymentsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
