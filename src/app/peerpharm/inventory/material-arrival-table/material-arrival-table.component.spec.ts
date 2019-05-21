import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialArrivalTableComponent } from './material-arrival-table.component';

describe('MaterialArrivalTableComponent', () => {
  let component: MaterialArrivalTableComponent;
  let fixture: ComponentFixture<MaterialArrivalTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialArrivalTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialArrivalTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
