import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryRequestsComponent } from './inventory-requests.component';

describe('InventoryRequestsComponent', () => {
  let component: InventoryRequestsComponent;
  let fixture: ComponentFixture<InventoryRequestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryRequestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
