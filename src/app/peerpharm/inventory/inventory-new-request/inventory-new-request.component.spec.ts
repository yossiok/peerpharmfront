import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryNewRequestComponent } from './inventory-new-request.component';

describe('InventoryNewRequestComponent', () => {
  let component: InventoryNewRequestComponent;
  let fixture: ComponentFixture<InventoryNewRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryNewRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryNewRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
