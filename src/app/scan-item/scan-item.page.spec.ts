import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScanItemPage } from './scan-item.page';

describe('ScanItemPage', () => {
  let component: ScanItemPage;
  let fixture: ComponentFixture<ScanItemPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ScanItemPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
