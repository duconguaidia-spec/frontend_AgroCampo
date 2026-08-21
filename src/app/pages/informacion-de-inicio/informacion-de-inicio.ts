import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface Caracteristica {
  icono: 'educacion' | 'reportes';
  titulo: string;
  subtitulo: string;
  cifra: string;
  cifraLabel: string;
  ruta: string;
}


interface PerfilUsuario {
  titulo: string;
  descripcion: string;
  etiqueta: string;
  imagen: string;
}

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './informacion-de-inicio.html',
  styleUrl: './informacion-de-inicio.css',
})
export class InicioComponent {
  constructor(private readonly router: Router) {}

  readonly caracteristicas: Caracteristica[] = [
    {
      icono: 'educacion',
      titulo: 'Contenido Educativo',
      subtitulo: 'Foro de discusión, guías y videos técnicos.',
      cifra: '1.500+',
      cifraLabel: 'Conversaciones compartidas',
      ruta: '/foro',
    },
    {
      icono: 'reportes',
      titulo: 'Reportes y Estadísticas',
      subtitulo: 'Panel visual y exportación de datos.',
      cifra: '3.200+',
      cifraLabel: 'Registros analizados',
      ruta: '/estadisticas',
    },
  ];

  readonly perfiles: PerfilUsuario[] = [
    {

      titulo: 'Administrador General',
      etiqueta: 'AG',
      imagen: 'assets/images/campo-verde.jpg',
      descripcion:
        'Supervisa la plataforma, permisos, registros de veterinarias y estadísticas del sector.',
    },
    {
      titulo: 'Veterinario Registrado',
      etiqueta: 'VR',
      imagen: 'assets/images/campo-atardecer.jpg',
      descripcion:
        'Publica servicios, productos y responde consultas de la comunidad agropecuaria.',
    },
    {
      titulo: 'Usuario General ',
      etiqueta: 'UG',
      imagen: 'assets/images/campo-verde.jpg',
      descripcion:
        'Consulta información, mapa interactivo, contenido educativo, noticias y videos.',
    },
  ];

  protected irAModulo(ruta: string): void {
    void this.router.navigateByUrl(ruta);
  }
}

