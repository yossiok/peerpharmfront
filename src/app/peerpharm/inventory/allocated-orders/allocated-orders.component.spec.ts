import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllocatedOrdersComponent } from './allocated-orders.component';

describe('AllocatedOrdersComponent', () => {
  let component: AllocatedOrdersComponent;
  let fixture: ComponentFixture<AllocatedOrdersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllocatedOrdersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllocatedOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
