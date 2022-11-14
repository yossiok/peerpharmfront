import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComaxItemsIndexComponent } from './comax-items-index.component';

describe('ComaxItemsIndexComponent', () => {
  let component: ComaxItemsIndexComponent;
  let fixture: ComponentFixture<ComaxItemsIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComaxItemsIndexComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComaxItemsIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
