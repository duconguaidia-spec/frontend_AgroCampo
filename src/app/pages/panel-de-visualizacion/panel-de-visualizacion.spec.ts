import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelDeVisualizacion } from './panel-de-visualizacion';

describe('PanelDeVisualizacion', () => {
  let component: PanelDeVisualizacion;
  let fixture: ComponentFixture<PanelDeVisualizacion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanelDeVisualizacion],
    }).compileComponents();

    fixture = TestBed.createComponent(PanelDeVisualizacion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
