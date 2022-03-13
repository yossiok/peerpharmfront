import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulksArrivalComponent } from './bulks-arrival.component';

describe('BulksArrivalComponent', () => {
  let component: BulksArrivalComponent;
  let fixture: ComponentFixture<BulksArrivalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BulksArrivalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BulksArrivalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
