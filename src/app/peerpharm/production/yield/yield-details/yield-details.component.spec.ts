import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YieldDetailsComponent } from './yield-details.component';

describe('YieldDetailsComponent', () => {
  let component: YieldDetailsComponent;
  let fixture: ComponentFixture<YieldDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YieldDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(YieldDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
