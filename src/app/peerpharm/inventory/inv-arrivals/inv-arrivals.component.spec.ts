import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvArrivalsComponent } from './inv-arrivals.component';

describe('InvArrivalsComponent', () => {
  let component: InvArrivalsComponent;
  let fixture: ComponentFixture<InvArrivalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvArrivalsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvArrivalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
