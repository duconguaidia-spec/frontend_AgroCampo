import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportacionDeDatos } from './exportacion-de-datos';

describe('ExportacionDeDatos', () => {
  let component: ExportacionDeDatos;
  let fixture: ComponentFixture<ExportacionDeDatos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExportacionDeDatos],
    }).compileComponents();

    fixture = TestBed.createComponent(ExportacionDeDatos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
