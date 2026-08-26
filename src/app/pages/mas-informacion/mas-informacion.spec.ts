import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { SiteFooterComponent } from '../../shared/site-footer/site-footer';
import { SiteHeaderComponent } from '../../shared/site-header/site-header';


interface Modulo {
  titulo: string;
  requisitos: string;
  descripcion: string;
  ruta: string;
}


@Component({
  selector: 'app-mas-informacion',

  standalone: true,

  imports: [
    CommonModule,
    RouterLink,
    SiteHeaderComponent,
    SiteFooterComponent
  ],

  templateUrl: './mas-informacion.html',

  styleUrl: './mas-informacion.css',
})


export class MasInformacionComponent {


  protected readonly modulos: Modulo[] = [

    

    {
      titulo: 'Roles y usuarios',

      requisitos: 'RF 4–5',

      descripcion:
        'Auditoría de actividades y edición de datos personales, intereses y ubicación.',

      ruta: '/perfil'
    },


    

    {
      titulo: 'Gestión Agropecuaria',

      requisitos: 'RF 6–9',

      descripcion:
        'Registro de cultivos, ganado, producción local, inventario y noticias del sector.',

      ruta: '/estadisticas'
    },


    
    {
      titulo: 'Veterinarias',

      requisitos: 'RF 10–13',

      descripcion:
        'Mapa interactivo, registro, catálogo de servicios y contactos de veterinarias.',

      ruta: '/veterinarias'
    },



    {
      titulo: 'Contenido Educativo',

      requisitos: 'RF 14–17',

      descripcion:
        'Videos, artículos, guías y foro de discusión para compartir experiencias.',

      ruta: '/foro'
    },



    {
      titulo: 'Reportes y Análisis',

      requisitos: 'RF 18–20',

      descripcion:
        'Reportes de actividad, paneles de visualización y exportación de datos.',

      ruta: '/estadisticas'
    },


    
    {
      titulo: 'Soporte y Mantenimiento',

      requisitos: 'RF 21–22',

      descripcion:
        'Preguntas frecuentes y canal para reportar incidencias técnicas.',

      ruta: '/ayuda-soporte'
    }

  ];

}