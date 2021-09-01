import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShelfChangeComponent } from './shelf-change.component';

describe('ShelfChangeComponent', () => {
  let component: ShelfChangeComponent;
  let fixture: ComponentFixture<ShelfChangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShelfChangeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShelfChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
