import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CostumersListComponent } from './costumers-list.component';

describe('CostumersListComponent', () => {
  let component: CostumersListComponent;
  let fixture: ComponentFixture<CostumersListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CostumersListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CostumersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
