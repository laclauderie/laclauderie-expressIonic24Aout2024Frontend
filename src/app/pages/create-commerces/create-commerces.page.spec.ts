import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateCommercesPage } from './create-commerces.page';

describe('CreateCommercesPage', () => {
  let component: CreateCommercesPage;
  let fixture: ComponentFixture<CreateCommercesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCommercesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
