import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmptHistoryComponent } from './cmpt-history.component';

describe('CmptHistoryComponent', () => {
  let component: CmptHistoryComponent;
  let fixture: ComponentFixture<CmptHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CmptHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CmptHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
