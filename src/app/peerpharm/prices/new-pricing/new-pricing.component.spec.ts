import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPricingComponent } from './new-pricing.component';

describe('NewPricingComponent', () => {
  let component: NewPricingComponent;
  let fixture: ComponentFixture<NewPricingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewPricingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPricingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
