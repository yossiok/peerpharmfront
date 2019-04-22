import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpectedArrivalsComponent } from './expected-arrivals.component';

describe('ExpectedArrivalsComponent', () => {
  let component: ExpectedArrivalsComponent;
  let fixture: ComponentFixture<ExpectedArrivalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpectedArrivalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpectedArrivalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
