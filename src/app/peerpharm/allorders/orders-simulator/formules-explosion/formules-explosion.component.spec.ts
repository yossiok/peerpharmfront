import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormulesExplosionComponent } from './formules-explosion.component';

describe('FormulesExplosionComponent', () => {
  let component: FormulesExplosionComponent;
  let fixture: ComponentFixture<FormulesExplosionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormulesExplosionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormulesExplosionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
