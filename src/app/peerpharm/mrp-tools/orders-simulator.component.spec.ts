import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersSimulatorComponent } from './orders-simulator.component';

describe('OrdersSimulatorComponent', () => {
  let component: OrdersSimulatorComponent;
  let fixture: ComponentFixture<OrdersSimulatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrdersSimulatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersSimulatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
