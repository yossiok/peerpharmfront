import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubTaskCardComponent } from './sub-task-card.component';

describe('SubTaskCardComponent', () => {
  let component: SubTaskCardComponent;
  let fixture: ComponentFixture<SubTaskCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubTaskCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubTaskCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
