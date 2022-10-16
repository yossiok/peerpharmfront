import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailPurchaseOrderComponent } from './email-purchase-order.component';

describe('EmailPurchaseOrderComponent', () => {
  let component: EmailPurchaseOrderComponent;
  let fixture: ComponentFixture<EmailPurchaseOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailPurchaseOrderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailPurchaseOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
