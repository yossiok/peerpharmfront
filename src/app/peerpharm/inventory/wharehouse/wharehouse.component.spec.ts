import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WharehouseComponent } from './wharehouse.component';

describe('WharehouseComponent', () => {
  let component: WharehouseComponent;
  let fixture: ComponentFixture<WharehouseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WharehouseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WharehouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
