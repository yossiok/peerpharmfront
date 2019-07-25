import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MakeupdetailsComponent } from './makeupdetails.component';

describe('MakeupdetailsComponent', () => {
  let component: MakeupdetailsComponent;
  let fixture: ComponentFixture<MakeupdetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MakeupdetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakeupdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
