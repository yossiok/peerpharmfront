import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmxInvoicesComponent } from './cmx-invoices.component';

describe('CmxInvoicesComponent', () => {
  let component: CmxInvoicesComponent;
  let fixture: ComponentFixture<CmxInvoicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CmxInvoicesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CmxInvoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
