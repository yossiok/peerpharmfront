import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsExplosionComponent } from './items-explosion.component';

describe('ItemsExplosionComponent', () => {
  let component: ItemsExplosionComponent;
  let fixture: ComponentFixture<ItemsExplosionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemsExplosionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemsExplosionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
