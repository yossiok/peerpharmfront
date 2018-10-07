import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemDocumentsComponent } from './item-documents.component';

describe('ItemDocumentsComponent', () => {
  let component: ItemDocumentsComponent;
  let fixture: ComponentFixture<ItemDocumentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemDocumentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
