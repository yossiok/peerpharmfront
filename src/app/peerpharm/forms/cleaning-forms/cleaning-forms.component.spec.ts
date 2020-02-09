import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CleaningFormsComponent } from './cleaning-forms.component';

describe('CleaningFormsComponent', () => {
  let component: CleaningFormsComponent;
  let fixture: ComponentFixture<CleaningFormsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CleaningFormsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CleaningFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
