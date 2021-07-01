import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemSuppliersComponent } from './item-suppliers.component';

describe('ItemSuppliersComponent', () => {
  let component: ItemSuppliersComponent;
  let fixture: ComponentFixture<ItemSuppliersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemSuppliersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemSuppliersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
