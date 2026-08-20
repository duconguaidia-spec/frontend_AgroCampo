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
}

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './informacion-de-inicio.html',
  styleUrl: './informacion-de-inicio.css',
})
export class InicioComponent {
  constructor(private router: Router) {}

  caracteristicas: Caracteristica[] = [
    {
      icono: 'educacion',
      titulo: 'Contenido Educativo',
      subtitulo: 'Foro de discusión · Videos',
      cifra: '1.500+',
      cifraLabel: 'Foros Registrados',
      ruta: '/contenido-educativo',
    },
    {
      icono: 'reportes',
      titulo: 'Reportes y Estadísticas',
      subtitulo: 'Panel visual y exportación de datos',
      cifra: '3.200+',
      cifraLabel: 'Clientes Registrados',
      ruta: '/reportes-estadisticas',
    }
  ];

  perfiles: PerfilUsuario[] = [
    {
      imagen: 'assets/images/campo-verde.jpg',
      titulo: 'Guía',
      descripcion: 'Administra, actualiza y relaciona los datos del sector agropecuario.'
    },
    {
      imagen: 'assets/images/campo-atardecer.jpg',
      titulo: 'Veterinarias',
      descripcion: 'Publica información sobre su veterinaria, servicios, productos y atiende consultas de sus usuarios.'
    },
    {
      imagen: 'assets/images/fondo-login.png',
      titulo: 'Administradores',
      descripcion: 'Supervisa el correcto uso de la plataforma, gestiona y valida el registro de los usuarios y veterinarios.'
    },
    {
      imagen: 'assets/images/campo-verde.jpg',
      titulo: 'Usuario General',
      descripcion: 'Consulta información, visualiza el mapa interactivo, contenido educativo y videos.'
    }
  ];

  irAModulo(ruta: string): void {
    this.router.navigate([ruta]);
  }
}
