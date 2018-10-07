import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemDetailsTabComponent } from './item-details-tab.component';

describe('ItemDetailsTabComponent', () => {
  let component: ItemDetailsTabComponent;
  let fixture: ComponentFixture<ItemDetailsTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemDetailsTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemDetailsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
