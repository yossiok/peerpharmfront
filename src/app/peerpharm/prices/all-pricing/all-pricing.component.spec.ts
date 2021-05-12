import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllPricingComponent } from './all-pricing.component';

describe('AllPricingComponent', () => {
  let component: AllPricingComponent;
  let fixture: ComponentFixture<AllPricingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllPricingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllPricingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
