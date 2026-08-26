import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SiteFooterComponent } from '../../shared/site-footer/site-footer';
import { SiteHeaderComponent } from '../../shared/site-header/site-header';

interface Publicacion {
  id: number;
  categoria: string;
  titulo: string;
  resumen: string;
  autor: string;
  rol: string;
  respuestas: number;
  vistas: number;
  guardado?: boolean;
  urgente?: boolean;
}

const CLAVE_STORAGE = 'agrocampo_foro_publicaciones';

@Component({
  selector: 'app-foro',
  standalone: true,
  imports: [CommonModule, FormsModule, SiteHeaderComponent, SiteFooterComponent],
  templateUrl: './foro.html',
  styleUrl: './foro.css',
})
export class ForoComponent implements OnInit {
  protected readonly categorias = [
    'Todo',
    'Cultivos',
    'Ganadería',
    'Maquinaria',
    'Plagas',
    'Riego',
    'Clima',
  ];

  // Tipos válidos para el formulario de nueva publicación (sin la opción "Todo")
  protected readonly tiposPublicacion = [
    'Cultivos',
    'Ganadería',
    'Maquinaria',
    'Plagas',
    'Riego',
    'Clima',
  ];

  protected categoriaActiva = 'Todo';
  protected busqueda = '';
  protected publicarAbierto = false;

  // Campos del formulario de nueva publicación
  protected nuevoTitulo = '';
  protected nuevaCategoria = this.tiposPublicacion[0];
  protected nuevaDescripcion = '';

  protected publicaciones: Publicacion[] = [
    {
      id: 1,
      categoria: 'Cultivos',
      titulo: 'Guía completa: Rotación de cultivos para suelos colombianos',
      resumen:
        'Después de 20 años de experiencia en el Tolima, comparto lo que aprendí sobre rotación de cultivos para suelos arcillosos y francos.',
      autor: 'Carlos Rodríguez',
      rol: 'Agrónomo · Tolima',
      respuestas: 89,
      vistas: 4230,
    },
    {
      id: 2,
      categoria: 'Plagas',
      titulo: 'Mancha foliar en arroz: ¿Pyricularia oryzae o Helminthosporium?',
      resumen:
        'Mis plantas de arroz de 45 días están mostrando lesiones elípticas de color gris con halo amarillo. ¿Alguien puede ayudarme a identificarla?',
      autor: 'Luis Martínez',
      rol: 'Arrocero · Casanare',
      respuestas: 34,
      vistas: 891,
      urgente: true,
    },
    {
      id: 3,
      categoria: 'Ganadería',
      titulo: 'Experiencia con pasto Brachiaria híbrido Cayman en Córdoba',
      resumen:
        'Comparto mi experiencia estableciendo 40 hectáreas en suelo ácido de Montería y los resultados del primer ciclo de pastoreo.',
      autor: 'Andrés Palomino',
      rol: 'Ganadero · Córdoba',
      respuestas: 21,
      vistas: 567,
    },
    {
      id: 4,
      categoria: 'Riego',
      titulo: '¿Vale la pena el riego por goteo subterráneo para aguacate Hass?',
      resumen:
        'Tengo 8 hectáreas en pendiente y evalúo cambiar de aspersión a goteo subterráneo. Me interesa conocer costos y rendimientos.',
      autor: 'María Vélez',
      rol: 'Fruticultora · Antioquia',
      respuestas: 17,
      vistas: 412,
    },
    {
      id: 5,
      categoria: 'Maquinaria',
      titulo: 'Comparativa de tractores 80–100 HP: John Deere 5090E vs Massey Ferguson 4710',
      resumen:
        'Estoy por comprar mi primer tractor para una finca de 120 hectáreas. ¿Cuál recomiendan considerando el servicio técnico regional?',
      autor: 'Eduardo Ríos',
      rol: 'Agricultor · Meta',
      respuestas: 48,
      vistas: 1203,
    },
  ];

  ngOnInit(): void {
    this.cargarPublicaciones();
  }

  protected get publicacionesFiltradas(): Publicacion[] {
    const termino = this.busqueda.trim().toLowerCase();
    return this.publicaciones.filter(
      (post) =>
        (this.categoriaActiva === 'Todo' || post.categoria === this.categoriaActiva) &&
        (!termino ||
          `${post.titulo} ${post.resumen} ${post.categoria}`.toLowerCase().includes(termino)),
    );
  }

  protected seleccionarCategoria(categoria: string): void {
    this.categoriaActiva = categoria;
  }

  protected actualizarBusqueda(event: Event): void {
    this.busqueda = (event.target as HTMLInputElement).value;
  }

  protected alternarGuardado(post: Publicacion): void {
    post.guardado = !post.guardado;
    this.guardarPublicaciones();
  }

  protected crearPublicacion(): void {
    const titulo = this.nuevoTitulo.trim();
    const descripcion = this.nuevaDescripcion.trim();
    if (!titulo || !descripcion) return;

    this.publicaciones = [
      {
        id: Date.now(),
        categoria: this.nuevaCategoria,
        titulo,
        resumen: descripcion,
        autor: 'Rafael Camilo',
        rol: 'Usuario General · Casanare',
        respuestas: 0,
        vistas: 1,
      },
      ...this.publicaciones,
    ];

    this.guardarPublicaciones();
    this.cerrarFormulario();
  }

  protected cerrarFormulario(): void {
    this.nuevoTitulo = '';
    this.nuevaDescripcion = '';
    this.nuevaCategoria = this.tiposPublicacion[0];
    this.publicarAbierto = false;
  }

  private cargarPublicaciones(): void {
    const datosGuardados = localStorage.getItem(CLAVE_STORAGE);
    if (!datosGuardados) return;
    this.publicaciones = JSON.parse(datosGuardados);
  }

  private guardarPublicaciones(): void {
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(this.publicaciones));
  }
}