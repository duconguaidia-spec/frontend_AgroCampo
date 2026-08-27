import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadisticasSectorComponent } from './estadisticas-sector';

describe('EstadisticasSectorComponent', () => {
  let component: EstadisticasSectorComponent;
  let fixture: ComponentFixture<EstadisticasSectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstadisticasSectorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EstadisticasSectorComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
