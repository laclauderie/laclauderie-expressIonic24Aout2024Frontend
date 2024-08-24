import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShowDetailPage } from './show-detail.page';

describe('ShowDetailPage', () => {
  let component: ShowDetailPage;
  let fixture: ComponentFixture<ShowDetailPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
