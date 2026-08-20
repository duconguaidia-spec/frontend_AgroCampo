import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SiteFooterComponent } from '../../shared/site-footer/site-footer';
import { SiteHeaderComponent } from '../../shared/site-header/site-header';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [FormsModule, SiteHeaderComponent, SiteFooterComponent],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})
export class PerfilComponent {
  protected readonly perfil = { nombre: 'Rafael Camilo', apellido: 'Torongo Martínez', telefono: '312 555 0184', ubicacion: 'Yopal, Casanare', rol: 'Usuario General' };
  protected readonly intereses = ['Maíz', 'Trigo', 'Ganado bovino', 'Irrigación', 'Agricultura sostenible', 'Plagas'];
  protected readonly interesesActivos = new Set(['Maíz', 'Trigo', 'Ganado bovino', 'Irrigación']);
  protected guardado = false;

  protected alternarInteres(interes: string): void {
    this.interesesActivos.has(interes) ? this.interesesActivos.delete(interes) : this.interesesActivos.add(interes);
    this.guardado = false;
  }

  protected guardar(): void { this.guardado = true; }
}
