import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormuleProductionComponent } from './formule-production.component';

describe('FormuleProductionComponent', () => {
  let component: FormuleProductionComponent;
  let fixture: ComponentFixture<FormuleProductionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormuleProductionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormuleProductionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
