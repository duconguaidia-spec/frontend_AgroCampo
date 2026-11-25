import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, catchError, map, tap, throwError, timeout } from 'rxjs';

export interface ProductoVeterinaria {
  id: number;
  nombre: string;
  descripcion: string;
  estilo: string;
  imagenUrl?: string;
  precio?: number;
}

export interface Veterinaria {
  id: string;
  nombre: string;
  ciudad: string;
  distancia: string;
  servicios: string[];
  telefono: string;
  direccion: string;
  descripcion: string;
  horarios: string;
  color: string;
  latitud?: number;
  longitud?: number;
  productos: ProductoVeterinaria[];
}

export interface NuevoProductoVeterinaria {
  nombre: string;
  descripcion?: string;
  imagen_url?: string;
  precio: number;
}

export interface NuevaVeterinaria {
  nombre: string;
  descripcion: string;
  direccion: string;
  ciudad: string;
  departamento?: string;
  telefono: string;
  horario_atencion: string;
  productos: NuevoProductoVeterinaria[];
  servicios?: { nombre: string; descripcion?: string; precio: number }[];
}

interface VeterinariaApi {
  id: number;
  nombre: string;
  descripcion?: string;
  direccion: string;
  ciudad: string;
  departamento?: string;
  telefono: string;
  horario_atencion?: string;
  latitud?: number | null;
  longitud?: number | null;
  servicios?: { nombre: string }[];
}

interface DetalleVeterinariaApi {
  veterinaria: VeterinariaApi;
  servicios: { id?: number; nombre: string; descripcion?: string; precio?: number }[];
  productos: { id: number; nombre: string; descripcion?: string; imagen_url?: string; precio?: number }[];
}

interface Respuesta<T> {
  success: boolean;
  message?: string;
  data: T;
}

const URL_VETERINARIAS = '/api/v1/veterinarias';
const COLORES = ['#2a8b5a', '#2672ad', '#a66d38', '#7b5aa7'];

@Injectable({ providedIn: 'root' })
export class VeterinariasService {
  private readonly http = inject(HttpClient);
  private readonly datos = signal<Veterinaria[]>([]);
  readonly veterinarias = this.datos.asReadonly();

  subirImagen(archivo: File): Observable<string> {
    const datos = new FormData();
    datos.append('imagen', archivo);
    return this.http.post<Respuesta<{ url: string }>>('/api/v1/imagenes/productos', datos).pipe(
      timeout({ first: 20000 }),
      map((respuesta) => {
        if (!respuesta.success || !respuesta.data?.url) throw new Error(respuesta.message || 'No fue posible subir la imagen.');
        return respuesta.data.url;
      }),
      catchError((error) => throwError(() => new Error(
        error.name === 'TimeoutError'
          ? 'La subida tardó demasiado. Comprueba la conexión con la MID e inténtalo de nuevo.'
          : error.status === 0
            ? 'No se pudo conectar con la MID para subir la imagen.'
            : error.error?.message || error.message || 'No fue posible subir la imagen.',
      ))),
    );
  }

  eliminar(id: string): Observable<void> {
    return this.http.delete<Respuesta<unknown>>(`${URL_VETERINARIAS}/${encodeURIComponent(id)}`).pipe(
      map((respuesta) => {
        if (!respuesta.success) throw new Error(respuesta.message || 'No fue posible eliminar la veterinaria.');
        this.datos.update((items) => items.filter((item) => item.id !== id));
      }),
    );
  }

  listar(): Observable<Veterinaria[]> {
    return this.http.get<Respuesta<VeterinariaApi[]>>(URL_VETERINARIAS).pipe(
      map((respuesta) => {
        if (!respuesta.success || !Array.isArray(respuesta.data)) {
          throw new Error(respuesta.message || 'El MID devolvió una lista de veterinarias inválida.');
        }
        return respuesta.data.map((item, indice) => this.convertirVeterinaria(item, item.servicios ?? [], indice));
      }),
      tap((veterinarias) => this.datos.set(veterinarias)),
    );
  }

  obtenerDetalle(id: string): Observable<Veterinaria> {
    return this.http.get<Respuesta<DetalleVeterinariaApi>>(`${URL_VETERINARIAS}/${encodeURIComponent(id)}`).pipe(
      map((respuesta) => {
        if (!respuesta.success || !respuesta.data?.veterinaria) {
          throw new Error(respuesta.message || 'El MID no devolvió el detalle de la veterinaria.');
        }
        const detalle = respuesta.data;
        const indice = this.datos().findIndex((item) => item.id === String(detalle.veterinaria.id));
        const veterinaria = this.convertirVeterinaria(detalle.veterinaria, detalle.servicios ?? [], Math.max(indice, 0));
        veterinaria.productos = (detalle.productos ?? []).map((producto) => ({
          id: producto.id,
          nombre: producto.nombre,
          descripcion: producto.descripcion ?? '',
          estilo: 'custom',
          imagenUrl: producto.imagen_url,
          precio: producto.precio,
        }));
        return veterinaria;
      }),
      tap((veterinaria) => this.actualizarLista(veterinaria)),
    );
  }

  crear(datos: NuevaVeterinaria): Observable<Veterinaria> {
    return this.http.post<Respuesta<{ veterinaria: VeterinariaApi; productos: { id: number; nombre: string; descripcion?: string; imagen_url?: string; precio?: number }[]; servicios?: { nombre: string }[] }>>(URL_VETERINARIAS, datos).pipe(
      map((respuesta) => {
        if (!respuesta.success || !respuesta.data?.veterinaria) {
          throw new Error(respuesta.message || 'El MID no confirmó el registro de la veterinaria.');
        }
        const veterinaria = this.convertirVeterinaria(respuesta.data.veterinaria, respuesta.data.servicios ?? [], this.datos().length);
        veterinaria.productos = (respuesta.data.productos ?? []).map((producto) => ({
          id: producto.id,
          nombre: producto.nombre,
          descripcion: producto.descripcion ?? '',
          estilo: 'custom',
          imagenUrl: producto.imagen_url,
          precio: producto.precio,
        }));
        return veterinaria;
      }),
      tap((veterinaria) => this.actualizarLista(veterinaria)),
    );
  }

  actualizar(id: string, cambios: Pick<Veterinaria, 'nombre' | 'descripcion' | 'direccion' | 'telefono' | 'horarios'>): Observable<void> {
    return this.http.put<Respuesta<unknown>>(`${URL_VETERINARIAS}/${encodeURIComponent(id)}`, {
      nombre: cambios.nombre,
      descripcion: cambios.descripcion,
      direccion: cambios.direccion,
      telefono: cambios.telefono,
      horario_atencion: cambios.horarios,
    }).pipe(
      map((respuesta) => {
        if (!respuesta.success) throw new Error(respuesta.message || 'No fue posible actualizar la veterinaria.');
        this.datos.update((items) => items.map((item) => item.id === id ? { ...item, ...cambios } : item));
      }),
    );
  }

  guardarProducto(idVeterinaria: string, producto: ProductoVeterinaria): Observable<ProductoVeterinaria> {
    const url = `${URL_VETERINARIAS}/${encodeURIComponent(idVeterinaria)}/productos`;
    const datos = {
      nombre: producto.nombre.trim(), descripcion: producto.descripcion,
      imagen_url: producto.imagenUrl ?? '', precio: producto.precio ?? 0,
    };
    const peticion = producto.id
      ? this.http.put<Respuesta<{ id: number }>>(`${url}/${producto.id}`, datos)
      : this.http.post<Respuesta<{ id: number }>>(url, datos);
    return peticion.pipe(
      map((respuesta) => {
        if (!respuesta.success || !respuesta.data?.id) throw new Error(respuesta.message || 'No fue posible guardar el producto.');
        return { ...producto, id: respuesta.data.id };
      }),
      tap((guardado) => this.datos.update((items) => items.map((item) => item.id !== idVeterinaria ? item : {
        ...item,
        productos: producto.id
          ? item.productos.map((actual) => actual.id === guardado.id ? guardado : actual)
          : [...item.productos, guardado],
      }))),
    );
  }

  eliminarProducto(idVeterinaria: string, idProducto: number): Observable<void> {
    return this.http.delete<Respuesta<unknown>>(`${URL_VETERINARIAS}/${encodeURIComponent(idVeterinaria)}/productos/${idProducto}`).pipe(
      map((respuesta) => {
        if (!respuesta.success) throw new Error(respuesta.message || 'No fue posible eliminar el producto.');
        this.datos.update((items) => items.map((item) => item.id !== idVeterinaria ? item : {
          ...item, productos: item.productos.filter((producto) => producto.id !== idProducto),
        }));
      }),
    );
  }

  private convertirVeterinaria(
    item: VeterinariaApi,
    servicios: { nombre: string }[],
    indice: number,
  ): Veterinaria {
    return {
      id: String(item.id),
      nombre: item.nombre,
      ciudad: [item.ciudad, item.departamento].filter(Boolean).join(', '),
      distancia: '',
      servicios: servicios.map((servicio) => servicio.nombre),
      telefono: item.telefono,
      direccion: item.direccion,
      descripcion: item.descripcion ?? '',
      horarios: item.horario_atencion ?? 'Consultar horarios',
      color: COLORES[indice % COLORES.length],
      latitud: item.latitud ?? undefined,
      longitud: item.longitud ?? undefined,
      productos: [],
    };
  }

  private actualizarLista(veterinaria: Veterinaria): void {
    this.datos.update((veterinarias) => {
      const existe = veterinarias.some((item) => item.id === veterinaria.id);
      return existe
        ? veterinarias.map((item) => item.id === veterinaria.id ? veterinaria : item)
        : [...veterinarias, veterinaria];
    });
  }
}
