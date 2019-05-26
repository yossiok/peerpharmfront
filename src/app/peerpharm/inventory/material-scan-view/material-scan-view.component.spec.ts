import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialScanViewComponent } from './material-scan-view.component';

describe('MaterialScanViewComponent', () => {
  let component: MaterialScanViewComponent;
  let fixture: ComponentFixture<MaterialScanViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialScanViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialScanViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
