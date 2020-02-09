import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckingformsComponent } from './checkingforms.component';

describe('CheckingformsComponent', () => {
  let component: CheckingformsComponent;
  let fixture: ComponentFixture<CheckingformsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckingformsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckingformsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
