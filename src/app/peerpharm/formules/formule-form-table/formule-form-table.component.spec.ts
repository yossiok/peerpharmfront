import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormuleFormTableComponent } from './formule-form-table.component';

describe('FormuleFormTableComponent', () => {
  let component: FormuleFormTableComponent;
  let fixture: ComponentFixture<FormuleFormTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormuleFormTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormuleFormTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
