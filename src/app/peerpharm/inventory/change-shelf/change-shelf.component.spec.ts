import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeShelfComponent } from './change-shelf.component';

describe('ChangeShelfComponent', () => {
  let component: ChangeShelfComponent;
  let fixture: ComponentFixture<ChangeShelfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeShelfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeShelfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
