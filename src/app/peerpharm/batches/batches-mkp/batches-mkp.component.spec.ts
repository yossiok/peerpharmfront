import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchesMkpComponent } from './batches-mkp.component';

describe('BatchesMkpComponent', () => {
  let component: BatchesMkpComponent;
  let fixture: ComponentFixture<BatchesMkpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BatchesMkpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BatchesMkpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
