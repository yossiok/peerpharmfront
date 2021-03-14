import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnfinishedProductsComponent } from './unfinished-products.component';

describe('UnfinishedProductsComponent', () => {
  let component: UnfinishedProductsComponent;
  let fixture: ComponentFixture<UnfinishedProductsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnfinishedProductsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnfinishedProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
