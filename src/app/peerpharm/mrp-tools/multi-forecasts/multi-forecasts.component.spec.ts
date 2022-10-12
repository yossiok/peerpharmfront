import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiForecastsComponent } from './multi-forecasts.component';

describe('MultiForecastsComponent', () => {
  let component: MultiForecastsComponent;
  let fixture: ComponentFixture<MultiForecastsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultiForecastsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiForecastsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
