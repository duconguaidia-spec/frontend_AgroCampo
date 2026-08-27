import { Injectable, computed, signal } from '@angular/core';

export type RolUsuario = 'administrador' | 'veterinario' | 'usuario';

export interface UsuarioSesion {
  nombre: string;
  correo: string;
  rol: RolUsuario;
}

export interface UsuarioRegistrado extends UsuarioSesion {
  contrasena: string;
}

@Injectable({ providedIn: 'root' })
export class AutenticacionService {
  private readonly claveSesion = 'agrocampo.sesion';
  private readonly claveUsuarios = 'agrocampo.usuarios';
  private readonly usuarioActual = signal<UsuarioSesion | null>(this.leerSesion());

  readonly usuario = this.usuarioActual.asReadonly();
  readonly autenticado = computed(() => this.usuarioActual() !== null);
  readonly esAdministrador = computed(() => this.usuarioActual()?.rol === 'administrador');
  readonly puedeGestionarVeterinarias = computed(() => {
    const rol = this.usuarioActual()?.rol;
    return rol === 'administrador' || rol === 'veterinario';
  });
  readonly puedeGestionarContenido = computed(() => {
    const rol = this.usuarioActual()?.rol;
    return rol === 'administrador' || rol === 'veterinario';
  });

  iniciarSesion(correo: string, contrasena: string, cuentasDemostracion: UsuarioRegistrado[] = []): boolean {
    const usuario = [...this.usuarios(), ...cuentasDemostracion].find(
      (item) => item.correo.toLocaleLowerCase() === correo.trim().toLocaleLowerCase() && item.contrasena === contrasena,
    );

    if (!usuario) {
      return false;
    }

    const sesion: UsuarioSesion = { nombre: usuario.nombre, correo: usuario.correo, rol: usuario.rol };
    localStorage.setItem(this.claveSesion, JSON.stringify(sesion));
    this.usuarioActual.set(sesion);
    return true;
  }

  registrarUsuario(datos: UsuarioRegistrado): boolean {
    const usuarios = this.usuarios();
    if (usuarios.some((item) => item.correo.toLocaleLowerCase() === datos.correo.toLocaleLowerCase())) {
      return false;
    }

    localStorage.setItem(this.claveUsuarios, JSON.stringify([...usuarios, datos]));
    return true;
  }

  cerrarSesion(): void {
    localStorage.removeItem(this.claveSesion);
    this.usuarioActual.set(null);
  }

  tieneRol(roles: RolUsuario[]): boolean {
    const rol = this.usuarioActual()?.rol;
    return !!rol && roles.includes(rol);
  }

  private leerSesion(): UsuarioSesion | null {
    try {
      const valor = localStorage.getItem(this.claveSesion);
      return valor ? (JSON.parse(valor) as UsuarioSesion) : null;
    } catch {
      return null;
    }
  }

  private usuarios(): UsuarioRegistrado[] {
    try {
      const guardados = localStorage.getItem(this.claveUsuarios);
      if (guardados) {
        return JSON.parse(guardados) as UsuarioRegistrado[];
      }
    } catch {
      localStorage.removeItem(this.claveUsuarios);
    }

    return [];
  }
}
