import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenOrderitemsComponent } from './open-orderitems.component';

describe('OpenOrderitemsComponent', () => {
  let component: OpenOrderitemsComponent;
  let fixture: ComponentFixture<OpenOrderitemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpenOrderitemsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenOrderitemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
