import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteeDeIncidencias } from './reportee-de-incidencias';

describe('ReporteeDeIncidencias', () => {
  let component: ReporteeDeIncidencias;
  let fixture: ComponentFixture<ReporteeDeIncidencias>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteeDeIncidencias],
    }).compileComponents();

    fixture = TestBed.createComponent(ReporteeDeIncidencias);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
