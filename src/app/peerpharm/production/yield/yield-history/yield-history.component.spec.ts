import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YieldHistoryComponent } from './yield-history.component';

describe('YieldHistoryComponent', () => {
  let component: YieldHistoryComponent;
  let fixture: ComponentFixture<YieldHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YieldHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(YieldHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
