import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface MenuItem {
  icono: string;
  nombre: string;
  ruta: string;
  roles: string[];
}

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class SidebarComponent implements OnInit {
  readonly menu: MenuItem[] = [
    {
      icono: '⌂',
      nombre: 'Inicio',
      ruta: '/informacion-de-inicio',
      roles: ['Administrador', 'Veterinario', 'Usuario', 'Invitado'],
    },
    {
      icono: 'ⓘ',
      nombre: 'Más información',
      ruta: '/mas-informacion',
      roles: ['Administrador', 'Veterinario', 'Usuario', 'Invitado'],
    },
  ];

  menuVisible: MenuItem[] = [];
  private rolUsuario = 'Invitado';

  ngOnInit(): void {
    this.cargarRol();
    this.menuVisible = this.menu.filter((item) =>
      item.roles.includes(this.rolUsuario),
    );
  }

  private cargarRol(): void {
    const usuarioGuardado = localStorage.getItem('usuarioActual');

    if (!usuarioGuardado) {
      return;
    }

    try {
      const usuario = JSON.parse(usuarioGuardado) as { rol?: string };
      this.rolUsuario = usuario.rol || this.rolUsuario;
    } catch {
      localStorage.removeItem('usuarioActual');
    }
  }
}
