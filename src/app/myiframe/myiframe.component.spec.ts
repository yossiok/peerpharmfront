import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyiframeComponent } from './myiframe.component';

describe('MyiframeComponent', () => {
  let component: MyiframeComponent;
  let fixture: ComponentFixture<MyiframeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyiframeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyiframeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
