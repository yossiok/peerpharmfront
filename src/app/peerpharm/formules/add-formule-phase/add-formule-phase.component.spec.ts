import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFormulePhaseComponent } from './add-formule-phase.component';

describe('AddFormulePhaseComponent', () => {
  let component: AddFormulePhaseComponent;
  let fixture: ComponentFixture<AddFormulePhaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddFormulePhaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFormulePhaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
