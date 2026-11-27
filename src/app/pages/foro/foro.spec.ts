import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AutenticacionService, RolUsuario } from '../../services/autenticacion';
import { ForoComponent } from './foro';

describe('ForoComponent', () => {
  let fixture: ComponentFixture<ForoComponent>;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForoComponent],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(ForoComponent);
    fixture.detectChanges();
    const base = '/api/v1/modulos';
    http.expectOne(`${base}/categorias-contenido`).flush({ data: [{ id: 2, nombre: 'Cultivos', tipo: 'foro', activo: true }] });
    http.expectOne(`${base}/temas`).flush({ data: [{ id: 5, titulo: 'Tema original', descripcion: 'Descripción', categoria_id: 2, activo: true, vistas: 4, autor: 'Autor del tema' }] });
    http.expectOne(`${base}/respuestas`).flush({ data: [] });
    http.expectOne(`${base}/temas-guardados`).flush({ data: [] });
  });

  afterEach(() => http.verify());

  function iniciarSesion(rol: RolUsuario): void {
    TestBed.inject(AutenticacionService).iniciarSesion('cuenta@example.invalid', 'prueba').subscribe();
    http.expectOne('/api/v1/cuenta/login').flush({ data: { id: 1, nombre: 'Cuenta de prueba', rol } });
    fixture.detectChanges();
  }

  function boton(texto: string): HTMLButtonElement | undefined {
    const host = fixture.nativeElement as HTMLElement;
    return [...host.querySelectorAll('button')].find((button) => button.textContent?.trim() === texto);
  }

  it('permite consultar el tema a un usuario común y oculta la edición', () => {
    iniciarSesion('usuario');
    expect(fixture.nativeElement.textContent).toContain('Tema original');
    expect(boton('Editar')).toBeUndefined();
  });

  for (const rol of ['administrador', 'veterinario'] as const) {
    it(`permite a ${rol} actualizar el tema y conserva sus datos en la lista`, async () => {
      iniciarSesion(rol);
      boton('Editar')!.click();
      fixture.detectChanges();
      await fixture.whenStable();
      const input = (fixture.nativeElement as HTMLElement).querySelector<HTMLInputElement>('input[name="titulo"]')!;
      expect(input.value).toBe('Tema original');
      input.value = 'Tema editado';
      input.dispatchEvent(new Event('input'));
      boton('Guardar cambios')!.click();
      const edicion = http.expectOne({ method: 'PUT', url: '/api/v1/modulos/temas/5' });
      expect(edicion.request.body).toEqual({ titulo: 'Tema editado', descripcion: 'Descripción', categoria_id: 2 });
      edicion.flush({ data: edicion.request.body });
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).toContain('Tema editado');
      expect(fixture.nativeElement.textContent).toContain('Autor del tema');
    });
  }
});
