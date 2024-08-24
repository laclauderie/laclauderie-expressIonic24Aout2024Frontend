import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateDetailsPage } from './create-details.page';

describe('CreateDetailsPage', () => {
  let component: CreateDetailsPage;
  let fixture: ComponentFixture<CreateDetailsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
