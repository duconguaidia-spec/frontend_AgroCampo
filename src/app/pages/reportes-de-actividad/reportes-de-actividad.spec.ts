import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportesDeActividad } from './reportes-de-actividad';

describe('ReportesDeActividad', () => {
  let component: ReportesDeActividad;
  let fixture: ComponentFixture<ReportesDeActividad>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportesDeActividad],
    }).compileComponents();

    fixture = TestBed.createComponent(ReportesDeActividad);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
