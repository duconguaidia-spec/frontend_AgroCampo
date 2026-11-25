import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, timeout } from 'rxjs';

export interface CategoriaApi { id: number; nombre: string; tipo?: string; activo?: boolean; }
export interface NoticiaApi {
  id: number; categoria_id: number; titulo: string; resumen: string; cuerpo?: string;
  fuente?: string; imagen_url?: string; publicada_en?: string; fecha_creacion?: string;
}
export interface ReporteApi { id: number; formato: string; estado: string; fecha_creacion: string; archivo_url?: string; }

export function mensajeApi(error: { error?: { message?: string } }, alternativa: string): string {
  return error.error?.message || alternativa;
}

@Injectable({ providedIn: 'root' })
export class ModulosService {
  private readonly http = inject(HttpClient);
  private readonly base = '/api/v1/modulos';

  listar<T>(recurso: string): Observable<T[]> { return this.obtener<T[]>(recurso); }

  obtener<T>(recurso: string, id?: string): Observable<T> {
    const ruta = id === undefined ? recurso : `${recurso}/${encodeURIComponent(id)}`;
    return this.http.get<{ data: T }>(`${this.base}/${ruta}`).pipe(timeout(12000), map(({ data }) => data));
  }

  crear<T>(recurso: string, datos: object): Observable<T> {
    return this.http.post<{ data: T }>(`${this.base}/${recurso}`, datos).pipe(timeout(12000), map(({ data }) => data));
  }
}
