import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulksCheckoutComponent } from './bulks-checkout.component';

describe('BulksCheckoutComponent', () => {
  let component: BulksCheckoutComponent;
  let fixture: ComponentFixture<BulksCheckoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BulksCheckoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BulksCheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
