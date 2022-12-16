import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseOrdersGroupedBySupplierComponent } from './purchase-orders-grouped-by-supplier.component';

describe('PurchaseOrdersGroupedBySupplierComponent', () => {
  let component: PurchaseOrdersGroupedBySupplierComponent;
  let fixture: ComponentFixture<PurchaseOrdersGroupedBySupplierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseOrdersGroupedBySupplierComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseOrdersGroupedBySupplierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
