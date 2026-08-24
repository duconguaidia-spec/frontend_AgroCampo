import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface RespuestaRecuperacion {
  success: boolean;
  message: string;
  token?: string;
}

@Injectable({
  providedIn: 'root'
})
export class RecuperacionContrasenaService {

  constructor() { }

  solicitarRecuperacion(email: string): Observable<RespuestaRecuperacion> {
    // TODO: reemplazar por llamada real al backend
    // return this.http.post<RespuestaRecuperacion>('/api/auth/forgot-password', { email });

    console.log(`Simulando envío de correo a: ${email}`);
    const tokenFalso = btoa(email + '-' + Date.now());
    console.log(`Enlace simulado: /restablecer-contrasena/${tokenFalso}`);

    return of({
      success: true,
      message: 'Si el correo existe, se ha enviado un enlace de recuperación.',
      token: tokenFalso
    }).pipe(delay(1200));
  }

  restablecerContrasena(token: string, nuevaContrasena: string): Observable<RespuestaRecuperacion> {
    // TODO: reemplazar por llamada real al backend
    // return this.http.post<RespuestaRecuperacion>('/api/auth/reset-password', { token, newPassword: nuevaContrasena });

    console.log(`Simulando reseteo de contraseña con token: ${token}`);

    return of({
      success: true,
      message: 'Contraseña actualizada correctamente.'
    }).pipe(delay(1200));
  }
}