import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, TimeoutError, catchError, map, throwError, timeout } from 'rxjs';

export const FORMATOS_IMAGEN = 'image/png,image/jpeg,image/gif';
const MAX_IMAGEN = 2 * 1024 * 1024;

@Injectable({ providedIn: 'root' })
export class ImagenesService {
  private readonly http = inject(HttpClient);

  subir(archivo: File, ruta = '/api/v1/imagenes'): Observable<string> {
    if (!FORMATOS_IMAGEN.split(',').includes(archivo.type) || archivo.size > MAX_IMAGEN) {
      return throwError(() => new Error('Selecciona una imagen PNG, JPG o GIF de máximo 2 MB.'));
    }
    const datos = new FormData();
    datos.append('imagen', archivo);
    return this.http.post<{ success: boolean; data?: { url: string }; message?: string }>(ruta, datos).pipe(
      timeout({ first: 20000 }),
      map((respuesta) => {
        if (!respuesta.success || !respuesta.data?.url) {
          throw new Error(respuesta.message || 'No fue posible subir la imagen.');
        }
        return respuesta.data.url;
      }),
      catchError((error: unknown) => {
        if (error instanceof TimeoutError) {
          return throwError(() => new Error('La subida tardó demasiado. Comprueba la conexión con la MID e inténtalo de nuevo.'));
        }
        if (error instanceof HttpErrorResponse) {
          const mensaje = error.status === 0
            ? 'No se pudo conectar con la MID para subir la imagen.'
            : error.error?.message || 'No fue posible subir la imagen.';
          return throwError(() => new Error(mensaje));
        }
        return throwError(() => error instanceof Error ? error : new Error('No fue posible subir la imagen.'));
      }),
    );
  }
}
