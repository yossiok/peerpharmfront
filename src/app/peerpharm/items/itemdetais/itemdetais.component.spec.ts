import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemdetaisComponent } from './itemdetais.component';

describe('ItemdetaisComponent', () => {
  let component: ItemdetaisComponent;
  let fixture: ComponentFixture<ItemdetaisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemdetaisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemdetaisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
