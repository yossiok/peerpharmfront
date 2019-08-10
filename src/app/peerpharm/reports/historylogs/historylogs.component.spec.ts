import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorylogsComponent } from './historylogs.component';

describe('HistorylogsComponent', () => {
  let component: HistorylogsComponent;
  let fixture: ComponentFixture<HistorylogsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistorylogsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistorylogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
