import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFormuleComponent } from './add-formule.component';

describe('AddFormuleComponent', () => {
  let component: AddFormuleComponent;
  let fixture: ComponentFixture<AddFormuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddFormuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFormuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
