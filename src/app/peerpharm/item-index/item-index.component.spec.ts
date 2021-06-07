import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemIndexComponent } from './item-index.component';

describe('ItemIndexComponent', () => {
  let component: ItemIndexComponent;
  let fixture: ComponentFixture<ItemIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemIndexComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
