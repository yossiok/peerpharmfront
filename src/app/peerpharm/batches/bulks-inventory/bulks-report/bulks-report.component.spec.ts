import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulksReportComponent } from './bulks-report.component';

describe('BulksReportComponent', () => {
  let component: BulksReportComponent;
  let fixture: ComponentFixture<BulksReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BulksReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BulksReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
