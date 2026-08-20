import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavigationItem {
  label: string;
  path: string;
}

@Component({
  selector: 'app-site-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './site-header.html',
  styleUrl: './site-header.css',
})
export class SiteHeaderComponent {
  protected readonly navigation: NavigationItem[] = [
    { label: 'Inicio', path: '/inicio' },
    { label: 'Estadísticas', path: '/estadisticas' },
    { label: 'Veterinarias', path: '/veterinarias' },
    { label: 'Noticias', path: '/noticias' },
    { label: 'Foro', path: '/foro' },
  ];

  protected readonly mobileMenuOpen = signal(false);
  protected readonly accountMenuOpen = signal(false);

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
}
