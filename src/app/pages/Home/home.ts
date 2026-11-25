import { Component, OnInit, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { timeout } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { SiteFooterComponent } from '../../shared/site-footer/site-footer';
import { SiteHeaderComponent } from '../../shared/site-header/site-header';


interface PerfilUsuario {
  titulo: string;
  descripcion: string;
  etiqueta: string;
}


@Component({
  selector: 'app-inicio',

  standalone: true,

  imports: [
    CommonModule,
    RouterLink,
    SiteHeaderComponent,
    SiteFooterComponent
  ],

  templateUrl: './home.html',

  styleUrl: './home.css',
})


export class HomeComponent implements OnInit {
  private readonly http = inject(HttpClient);
  protected readonly resumen = signal<{ Contadores: { ForosNoticias: number | null; Productores: number | null; Veterinarias: number | null; Eficiencia: number | null }; Noticias: { Id: number; Titulo: string }[] } | null>(null);

  ngOnInit(): void {
    this.http.get<NonNullable<ReturnType<typeof this.resumen>>>('/api/v1/home').pipe(timeout(12000)).subscribe({
      next: (resumen) => this.resumen.set(resumen),
      error: () => this.resumen.set(null),
    });
  }

  protected readonly perfiles: PerfilUsuario[] = [

    {
      titulo: 'Administrador General',
      etiqueta: 'AG',
      descripcion:
        'Supervisa la plataforma, permisos, registros de veterinarias y estadísticas del sector.',
    },

    {
      titulo: 'Veterinario Registrado',
      etiqueta: 'VR',
      descripcion:
        'Publica servicios, productos y responde consultas de la comunidad agropecuaria.',
    },

    {
      titulo: 'Usuario General',
      etiqueta: 'UG',
      descripcion:
        'Consulta información, mapa interactivo, contenido educativo, noticias y videos.',
    }

  ];

}
