import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { VeterinariasService } from './veterinarias';
import { vi } from 'vitest';

describe('VeterinariasService: conexión con MID', () => {
  let servicio: VeterinariasService;
  let http: HttpTestingController;
  const url = '/api/v1/veterinarias';

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    servicio = TestBed.inject(VeterinariasService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('termina con un error claro si la subida no recibe respuesta', () => {
    vi.useFakeTimers();
    try {
      let mensaje = '';
      servicio.subirImagen(new File(['png'], 'producto.png')).subscribe({ error: (error) => mensaje = error.message });
      const peticion = http.expectOne('/api/v1/imagenes/productos');
      vi.advanceTimersByTime(20001);
      expect(mensaje).toContain('La subida tardó demasiado');
      expect(peticion.cancelled).toBe(true);
    } finally { vi.useRealTimers(); }
  });

  it('sube la imagen como archivo y utiliza la URL persistente de la MID', () => {
    let urlImagen = '';
    const archivo = new File(['imagen'], 'producto.png', { type: 'image/png' });
    servicio.subirImagen(archivo).subscribe((url) => urlImagen = url);
    const peticion = http.expectOne('/api/v1/imagenes/productos');
    expect(peticion.request.body.get('imagen')).toBe(archivo);
    peticion.flush({ success: true, data: { url: '/api/v1/imagenes/productos/archivo.png' } });
    expect(urlImagen).toBe('/api/v1/imagenes/productos/archivo.png');
  });

  it('retira la veterinaria solamente después de confirmar el borrado', () => {
    cargarDetalle();
    servicio.eliminar('7').subscribe();
    expect(servicio.veterinarias().length).toBe(1);
    const peticion = http.expectOne(`${url}/7`);
    expect(peticion.request.method).toBe('DELETE');
    peticion.flush({ success: true });
    expect(servicio.veterinarias()).toEqual([]);
  });

  function cargarDetalle(): void {
    servicio.obtenerDetalle('7').subscribe();
    http.expectOne(`${url}/7`).flush({ success: true, data: {
      veterinaria: { id: 7, nombre: 'Clínica', ciudad: 'Yopal', direccion: 'Calle 1', telefono: '123' },
      servicios: [{ nombre: 'Consulta' }],
      productos: [{ id: 3, nombre: 'Producto', descripcion: 'Descripción', precio: 10 }],
    } });
  }

  it('consulta el detalle y conserva los IDs del servidor', () => {
    cargarDetalle();
    expect(servicio.veterinarias()[0].id).toBe('7');
    expect(servicio.veterinarias()[0].productos[0].id).toBe(3);
    expect(servicio.veterinarias()[0].servicios).toEqual(['Consulta']);
  });

  it('actualiza horarios en el contrato del MID y espera su confirmación', () => {
    cargarDetalle();
    servicio.actualizar('7', { nombre: 'Editada', descripcion: '', direccion: 'Calle 1', telefono: '123', horarios: '8 a 5' }).subscribe();
    expect(servicio.veterinarias()[0].nombre).toBe('Clínica');
    const peticion = http.expectOne(`${url}/7`);
    expect(peticion.request.method).toBe('PUT');
    expect(peticion.request.body.horario_atencion).toBe('8 a 5');
    peticion.flush({ success: true });
    expect(servicio.veterinarias()[0].nombre).toBe('Editada');
  });

  it('usa el ID recibido al crear un producto', () => {
    cargarDetalle();
    servicio.guardarProducto('7', { id: 0, nombre: 'Nuevo', descripcion: '', estilo: 'custom', precio: 20 }).subscribe();
    const peticion = http.expectOne(`${url}/7/productos`);
    expect(peticion.request.method).toBe('POST');
    peticion.flush({ success: true, data: { id: 12 } });
    expect(servicio.veterinarias()[0].productos.map((p) => p.id)).toEqual([3, 12]);
  });

  it('no cambia el estado ni anuncia éxito si el CRUD rechaza una edición', () => {
    cargarDetalle();
    let fallo = false;
    servicio.guardarProducto('7', { id: 3, nombre: 'Editado', descripcion: '', estilo: 'custom' }).subscribe({ error: () => fallo = true });
    const peticion = http.expectOne(`${url}/7/productos/3`);
    expect(peticion.request.method).toBe('PUT');
    peticion.flush({ success: false, message: 'No guardado' });
    expect(fallo).toBe(true);
    expect(servicio.veterinarias()[0].productos[0].nombre).toBe('Producto');
  });

  it('elimina solo después de la confirmación de la MID', () => {
    cargarDetalle();
    servicio.eliminarProducto('7', 3).subscribe();
    expect(servicio.veterinarias()[0].productos.length).toBe(1);
    const peticion = http.expectOne(`${url}/7/productos/3`);
    expect(peticion.request.method).toBe('DELETE');
    peticion.flush({ success: true });
    expect(servicio.veterinarias()[0].productos).toEqual([]);
  });

  it('conserva el producto cuando la MID está caída', () => {
    cargarDetalle();
    servicio.eliminarProducto('7', 3).subscribe({ error: () => undefined });
    http.expectOne(`${url}/7/productos/3`).flush({ message: 'CRUD no disponible' }, { status: 502, statusText: 'Bad Gateway' });
    expect(servicio.veterinarias()[0].productos.length).toBe(1);
  });
});
