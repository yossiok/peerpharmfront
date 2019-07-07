import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemreportsComponent } from './itemreports.component';

describe('ItemreportsComponent', () => {
  let component: ItemreportsComponent;
  let fixture: ComponentFixture<ItemreportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemreportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemreportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
