import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ItemDetailesPage } from './item-detailes.page';

describe('ItemDetailesPage', () => {
  let component: ItemDetailesPage;
  let fixture: ComponentFixture<ItemDetailesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemDetailesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
