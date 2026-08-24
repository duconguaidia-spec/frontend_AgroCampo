import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreguntasFrecuntes } from './preguntas-frecuntes';

describe('PreguntasFrecuntes', () => {
  let component: PreguntasFrecuntes;
  let fixture: ComponentFixture<PreguntasFrecuntes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreguntasFrecuntes],
    }).compileComponents();

    fixture = TestBed.createComponent(PreguntasFrecuntes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
