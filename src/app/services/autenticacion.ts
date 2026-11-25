import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, catchError, map, of, tap, timeout } from 'rxjs';

export type RolUsuario = 'administrador' | 'veterinario' | 'usuario';
export interface UsuarioSesion { id: number; nombre: string; apellido: string; correo: string; rol: RolUsuario; }
export interface UsuarioRegistrado { nombre: string; apellido: string; correo: string; telefono: string; contrasena: string; rol: RolUsuario; }
export interface PerfilCuenta extends UsuarioSesion { telefono: string; ubicacion: string; foto: string; intereses: string[]; }

const CUENTA = '/api/v1/cuenta';

@Injectable({ providedIn: 'root' })
export class AutenticacionService {
  private readonly http = inject(HttpClient);
  private readonly usuarioActual = signal<UsuarioSesion | null>(null);
  readonly usuario = this.usuarioActual.asReadonly();
  readonly autenticado = computed(() => this.usuarioActual() !== null);
  readonly esAdministrador = computed(() => this.usuarioActual()?.rol === 'administrador');
  readonly puedeGestionarVeterinarias = computed(() => this.tieneRol(['administrador', 'veterinario']));
  readonly puedeGestionarContenido = this.puedeGestionarVeterinarias;

  iniciarSesion(correo: string, contrasena: string): Observable<UsuarioSesion> {
    return this.http.post<{ data: UsuarioSesion }>(`${CUENTA}/login`, { correo, contrasena }).pipe(
      timeout(12000), map(({ data }) => data), tap((usuario) => this.usuarioActual.set(usuario)),
    );
  }

  verificarSesion(): Observable<boolean> {
    return this.http.get<{ data: UsuarioSesion }>(`${CUENTA}/sesion`).pipe(
      timeout(12000), tap(({ data }) => this.usuarioActual.set(data)), map(() => true),
      catchError(() => { this.usuarioActual.set(null); return of(false); }),
    );
  }

  registrarUsuario(datos: UsuarioRegistrado): Observable<unknown> {
    return this.http.post(`${CUENTA}/registro`, datos).pipe(timeout(12000));
  }

  cerrarSesion(): void {
    this.usuarioActual.set(null);
    this.http.delete(`${CUENTA}/sesion`).subscribe({ error: () => undefined });
  }

  tieneRol(roles: RolUsuario[]): boolean {
    const rol = this.usuarioActual()?.rol;
    return !!rol && roles.includes(rol);
  }

  obtenerPerfil(): Observable<PerfilCuenta> {
    return this.http.get<{ data: PerfilCuenta }>(`${CUENTA}/perfil`).pipe(timeout(12000), map(({ data }) => data));
  }

  guardarPerfil(datos: Pick<PerfilCuenta, 'nombre' | 'apellido' | 'telefono' | 'ubicacion' | 'foto' | 'intereses'>): Observable<unknown> {
    return this.http.put(`${CUENTA}/perfil`, datos).pipe(timeout(12000), tap(() => {
      this.usuarioActual.update((u) => u ? { ...u, nombre: datos.nombre, apellido: datos.apellido } : null);
    }));
  }
}
