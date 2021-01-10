import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemMovementReportsComponent } from './item-movement-reports.component';

describe('ItemMovementReportsComponent', () => {
  let component: ItemMovementReportsComponent;
  let fixture: ComponentFixture<ItemMovementReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemMovementReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemMovementReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
