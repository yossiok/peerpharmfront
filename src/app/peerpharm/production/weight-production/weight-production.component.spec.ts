import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WeightProductionComponent } from './weight-production.component';

describe('WeightProductionComponent', () => {
  let component: WeightProductionComponent;
  let fixture: ComponentFixture<WeightProductionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeightProductionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeightProductionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
