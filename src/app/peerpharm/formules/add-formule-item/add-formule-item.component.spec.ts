import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFormuleItemComponent } from './add-formule-item.component';

describe('AddFormuleItemComponent', () => {
  let component: AddFormuleItemComponent;
  let fixture: ComponentFixture<AddFormuleItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddFormuleItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFormuleItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
