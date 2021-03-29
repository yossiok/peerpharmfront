import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutServicesComponent } from './out-services.component';

describe('OutServicesComponent', () => {
  let component: OutServicesComponent;
  let fixture: ComponentFixture<OutServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OutServicesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OutServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
