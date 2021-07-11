import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvImportsComponent } from './inv-imports.component';

describe('InvImportsComponent', () => {
  let component: InvImportsComponent;
  let fixture: ComponentFixture<InvImportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvImportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvImportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
