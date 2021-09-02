import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BetweenWHComponent } from './between-wh.component';

describe('BetweenWHComponent', () => {
  let component: BetweenWHComponent;
  let fixture: ComponentFixture<BetweenWHComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BetweenWHComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BetweenWHComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
