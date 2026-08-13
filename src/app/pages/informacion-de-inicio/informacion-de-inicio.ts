import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

interface Caracteristica {
  icono: 'educacion' | 'reportes';
  titulo: string;
  subtitulo: string;
  cifra: string;
  cifraLabel: string;
}

interface PerfilUsuario {
  imagen: string;
  titulo: string;
  descripcion: string;
}

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './informacion-de-inicio.html',
  styleUrls: ['./informacion-de-inicio.css']
})
export class InicioComponent {

  anioActual: number = new Date().getFullYear();

  constructor(private router: Router) {}

  caracteristicas: Caracteristica[] = [
    {
      icono: 'educacion',
      titulo: 'Contenido Educativo',
      subtitulo: 'Foro de discusión · Videos',
      cifra: '1.500+',
      cifraLabel: 'Foros Registrados'
    },
    {
      icono: 'reportes',
      titulo: 'Reportes y Estadísticas',
      subtitulo: 'Panel visual y exportación de datos',
      cifra: '3.200+',
      cifraLabel: 'Clientes Registrados'
    }
  ];

  perfiles: PerfilUsuario[] = [
    {
      imagen: 'assets/images/perfil-guia.jpg',
      titulo: 'Guía',
      descripcion: 'Administra, actualiza y relaciona los datos del sector agropecuario.'
    },
    {
      imagen: 'assets/images/perfil-veterinarias.jpg',
      titulo: 'Veterinarias',
      descripcion: 'Publica información sobre su veterinaria, servicios, productos y atiende consultas de sus usuarios.'
    },
    {
      imagen: 'assets/images/perfil-administradores.jpg',
      titulo: 'Administradores',
      descripcion: 'Supervisa el correcto uso de la plataforma, gestiona y valida el registro de los usuarios y veterinarios.'
    },
    {
      imagen: 'assets/images/perfil-usuario-general.jpg',
      titulo: 'Usuario General',
      descripcion: 'Consulta información, visualiza el mapa interactivo, contenido educativo y videos.'
    }
  ];

  crearCuenta(): void {
    this.router.navigate(['/register']);
  }
}