import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialArrivalComponent } from './material-arrival.component';

describe('MaterialArrivalComponent', () => {
  let component: MaterialArrivalComponent;
  let fixture: ComponentFixture<MaterialArrivalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialArrivalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialArrivalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
