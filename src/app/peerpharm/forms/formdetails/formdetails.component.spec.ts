import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormdetailsComponent } from './formdetails.component';

describe('FormdetailsComponent', () => {
  let component: FormdetailsComponent;
  let fixture: ComponentFixture<FormdetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormdetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
