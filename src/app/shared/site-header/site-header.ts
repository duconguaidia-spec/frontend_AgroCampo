import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AutenticacionService, RolUsuario } from '../../services/autenticacion';

interface NavigationItem {
  label: string;
  path: string;
  roles?: RolUsuario[];
}

@Component({
  selector: 'app-site-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './site-header.html',
  styleUrl: './site-header.css',
})
export class SiteHeaderComponent {
  protected readonly autenticacion = inject(AutenticacionService);
  private readonly router = inject(Router);
  protected readonly navigation: NavigationItem[] = [
    { label: 'Inicio', path: '/inicio' },
    { label: 'Estadísticas', path: '/estadisticas' },
    { label: 'Veterinarias', path: '/veterinarias' },
    { label: 'Noticias', path: '/noticias' },
    { label: 'Foro', path: '/foro' },
    { label: 'Contenido', path: '/videos-explicativos' },
  ];

  protected readonly mobileMenuOpen = signal(false);
  protected readonly accountMenuOpen = signal(false);

  protected get navigationVisible(): NavigationItem[] {
    return this.navigation.filter((item) => !item.roles || this.autenticacion.tieneRol(item.roles));
  }

  protected closeMenus(): void {
    this.mobileMenuOpen.set(false);
    this.accountMenuOpen.set(false);
  }

  protected toggleMobileMenu(): void {
    this.mobileMenuOpen.update((open) => !open);
    this.accountMenuOpen.set(false);
  }

  protected toggleAccountMenu(): void {
    this.accountMenuOpen.update((open) => !open);
  }

  protected cerrarSesion(): void {
    this.autenticacion.cerrarSesion();
    this.closeMenus();
    this.router.navigate(['/pagina-de-inicio']);
  }
}
