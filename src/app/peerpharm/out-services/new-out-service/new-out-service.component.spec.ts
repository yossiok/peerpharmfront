import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewOutServiceComponent } from './new-out-service.component';

describe('NewOutServiceComponent', () => {
  let component: NewOutServiceComponent;
  let fixture: ComponentFixture<NewOutServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewOutServiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewOutServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
