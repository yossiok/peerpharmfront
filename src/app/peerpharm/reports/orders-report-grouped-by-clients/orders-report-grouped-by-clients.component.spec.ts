import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersReportGroupedByClientsComponent } from './orders-report-grouped-by-clients.component';

describe('OrdersReportGroupedByClientsComponent', () => {
  let component: OrdersReportGroupedByClientsComponent;
  let fixture: ComponentFixture<OrdersReportGroupedByClientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrdersReportGroupedByClientsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersReportGroupedByClientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
