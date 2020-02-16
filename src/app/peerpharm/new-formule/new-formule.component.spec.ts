import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewFormuleComponent } from './new-formule.component';

describe('NewFormuleComponent', () => {
  let component: NewFormuleComponent;
  let fixture: ComponentFixture<NewFormuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewFormuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewFormuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
