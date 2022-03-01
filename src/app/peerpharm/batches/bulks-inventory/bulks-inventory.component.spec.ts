import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulksInventoryComponent } from './bulks-inventory.component';

describe('BulksInventoryComponent', () => {
  let component: BulksInventoryComponent;
  let fixture: ComponentFixture<BulksInventoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BulksInventoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BulksInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
