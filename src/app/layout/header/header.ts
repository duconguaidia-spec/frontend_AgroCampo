import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';

interface UsuarioActual {
  nombre?: string;
  rol?: string;
}

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class HeaderComponent implements OnInit, OnDestroy {
  readonly nombreSistema = 'AgroCampo';
  readonly descripcionSistema = 'Gestión de información agropecuaria y veterinaria';

  usuario = 'Usuario';
  rol = 'Invitado';
  fechaActual = signal('');
  horaActual = signal('');

  private intervalo?: ReturnType<typeof setInterval>;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.cargarUsuario();
    this.actualizarFechaHora();
    this.intervalo = setInterval(() => this.actualizarFechaHora(), 1000);
  }

  ngOnDestroy(): void {
    if (this.intervalo) {
      clearInterval(this.intervalo);
    }
  }

  cerrarSesion(): void {
    localStorage.removeItem('usuarioActual');
    this.router.navigate(['/login']);
  }

  private cargarUsuario(): void {
    const usuarioGuardado = localStorage.getItem('usuarioActual');

    if (!usuarioGuardado) {
      return;
    }

    try {
      const usuario: UsuarioActual = JSON.parse(usuarioGuardado);
      this.usuario = usuario.nombre || this.usuario;
      this.rol = usuario.rol || this.rol;
    } catch {
      localStorage.removeItem('usuarioActual');
    }
  }

  private actualizarFechaHora(): void {
    const ahora = new Date();
    this.fechaActual.set(
      ahora.toLocaleDateString('es-CO', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }),
    );
    this.horaActual.set(
      ahora.toLocaleTimeString('es-CO', { hour12: false }),
    );
  }
}
