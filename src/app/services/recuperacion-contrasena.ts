import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, timeout } from 'rxjs';

export interface RespuestaRecuperacion { success: boolean; message: string; }

@Injectable({ providedIn: 'root' })
export class RecuperacionContrasenaService {
  private readonly http = inject(HttpClient);

  solicitarRecuperacion(correo: string): Observable<RespuestaRecuperacion> {
    return this.http.post<RespuestaRecuperacion>('/api/v1/cuenta/recuperar', { correo }).pipe(timeout(25000));
  }

  restablecerContrasena(token: string, contrasena: string): Observable<RespuestaRecuperacion> {
    return this.http.post<RespuestaRecuperacion>('/api/v1/cuenta/restablecer', { token, contrasena }).pipe(timeout(12000));
  }
}
