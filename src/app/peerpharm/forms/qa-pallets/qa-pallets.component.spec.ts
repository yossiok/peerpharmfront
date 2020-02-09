import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QaPalletsComponent } from './qa-pallets.component';

describe('QaPalletsComponent', () => {
  let component: QaPalletsComponent;
  let fixture: ComponentFixture<QaPalletsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QaPalletsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QaPalletsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
