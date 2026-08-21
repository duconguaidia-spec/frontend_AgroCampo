import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AyudaSoporteComponent } from './ayuda-soporte';

describe('AyudaSoporteComponent', () => {
  let component: AyudaSoporteComponent;
  let fixture: ComponentFixture<AyudaSoporteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AyudaSoporteComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AyudaSoporteComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
