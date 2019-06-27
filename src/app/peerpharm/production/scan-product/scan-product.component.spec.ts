import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScanProductComponent } from './scan-product.component';

describe('ScanProductComponent', () => {
  let component: ScanProductComponent;
  let fixture: ComponentFixture<ScanProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScanProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScanProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
