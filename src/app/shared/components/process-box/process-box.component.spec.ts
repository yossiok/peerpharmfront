import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessBoxComponent } from './process-box.component';

describe('ProcessBoxComponent', () => {
  let component: ProcessBoxComponent;
  let fixture: ComponentFixture<ProcessBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcessBoxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
