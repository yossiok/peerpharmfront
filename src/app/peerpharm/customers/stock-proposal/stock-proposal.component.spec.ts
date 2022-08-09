import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockProposalComponent } from './stock-proposal.component';

describe('StockProposalComponent', () => {
  let component: StockProposalComponent;
  let fixture: ComponentFixture<StockProposalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockProposalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockProposalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
