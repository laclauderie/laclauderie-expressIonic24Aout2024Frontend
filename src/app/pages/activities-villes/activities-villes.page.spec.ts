import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivitiesVillesPage } from './activities-villes.page';

describe('ActivitiesVillesPage', () => {
  let component: ActivitiesVillesPage;
  let fixture: ComponentFixture<ActivitiesVillesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivitiesVillesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
