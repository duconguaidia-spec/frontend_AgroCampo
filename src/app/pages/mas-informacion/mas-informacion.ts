import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Modulo {
  titulo: string;
  descripcion: string;
  etiqueta: string;
}

@Component({
  selector: 'app-mas-informacion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mas-informacion.html',
  styleUrl: './mas-informacion.css',
})
export class MasInformacionComponent {

  anioActual: number = new Date().getFullYear();

  modulos: Modulo[] = [
    {
      titulo: 'Gestion Agropecuaria',
      descripcion: 'Registro de cultivos, lotes de siembra, producción animal e inventario de insumos con trazabilidad completa.',
      etiqueta: 'Modulo 1'
    },
    {
      titulo: 'Registro Agropecuario',
      descripcion: 'Historiales clínicos, diagnósticos, vacunaciones y seguimiento de salud animal registrados por profesionales.',
      etiqueta: 'Modulo 2'
    },
    {
      titulo: 'Reportes Y Estadísticas',
      descripcion: 'Dashboards con KPIs del sector, estadísticas agregadas y exportación de datos en PDF y Excel.',
      etiqueta: 'Modulo 3'
    },
    {
      titulo: 'Directorio De Servicios',
      descripcion: 'Mapa interactivo de veterinarias geolocalizadas, catálogo de servicios, calificaciones y datos de contacto.',
      etiqueta: 'Modulo 4'
    },
    {
      titulo: 'Modulo Educativo',
      descripcion: 'Biblioteca de artículos y videos técnicos, foro comunitario, noticias y eventos del sector agropecuario.',
      etiqueta: 'Modulo 5'
    },
    {
      titulo: 'Seguridad Y Administración',
      descripcion: 'Control de accesos por roles, autenticación en dos pasos, auditoría de usuarios y gestión de plataforma.',
      etiqueta: 'Modulo 6'
    }
  ];
}
