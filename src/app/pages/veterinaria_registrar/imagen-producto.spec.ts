import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { AgregarVeterinariaComponent } from './veterinaria_registrar';

describe('Subida de imagen en el formulario de veterinaria', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [AgregarVeterinariaComponent],
    providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
  }));
  afterEach(() => TestBed.inject(HttpTestingController).verify());

  for (const falla of [false, true]) {
    it(falla ? 'libera el selector y muestra el error del servidor' : 'termina la carga y muestra la imagen sin otro clic', async () => {
      const fixture = TestBed.createComponent(AgregarVeterinariaComponent);
      fixture.detectChanges();
      const input: HTMLInputElement = fixture.nativeElement.querySelector('#product-file-input');
      Object.defineProperty(input, 'files', { value: [new File(['png'], 'producto.png', { type: 'image/png' })] });
      input.dispatchEvent(new Event('change', { bubbles: true }));
      await fixture.whenStable();
      expect(input.disabled).toBe(true);
      const request = TestBed.inject(HttpTestingController).expectOne('/api/v1/imagenes/productos');
      if (falla) request.flush({ message: 'No fue posible guardar la imagen' }, { status: 500, statusText: 'Error' });
      else request.flush({ success: true, data: { url: '/api/v1/imagenes/productos/prueba.png' } });
      await fixture.whenStable();
      expect(input.disabled).toBe(false);
      expect(fixture.nativeElement.textContent).not.toContain('Subiendo imagen del producto');
      if (falla) expect(fixture.nativeElement.textContent).toContain('No fue posible guardar la imagen');
      else expect(fixture.nativeElement.querySelector('.preview-img').getAttribute('src')).toContain('prueba.png');
    });
  }
});
