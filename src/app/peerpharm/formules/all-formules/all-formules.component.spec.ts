import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllFormulesComponent } from './all-formules.component';

describe('AllFormulesComponent', () => {
  let component: AllFormulesComponent;
  let fixture: ComponentFixture<AllFormulesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllFormulesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllFormulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
