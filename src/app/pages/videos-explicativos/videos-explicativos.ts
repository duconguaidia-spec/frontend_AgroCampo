import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteFooterComponent } from '../../shared/site-footer/site-footer';
import { SiteHeaderComponent } from '../../shared/site-header/site-header';
import { FormsModule } from '@angular/forms';
import { AutenticacionService } from '../../services/autenticacion';

interface Video {
  id: number;
  categoria: 'Cultivos' | 'Ganadería' | 'Maquinaria' | 'Plagas';
  titulo: string;
  descripcion: string;
  imagen: string;
  enlace: string;
}

const CLAVE_ALMACENAMIENTO = 'agrocampo_videos';

@Component({
  selector: 'app-videos-explicativos',
  standalone: true,
  imports: [CommonModule, FormsModule, SiteHeaderComponent, SiteFooterComponent],
  templateUrl: './videos-explicativos.html',
  styleUrl: './videos-explicativos.css',
})
export class VideosExplicativosComponent implements OnInit {
  protected readonly categorias = [
    'Todo',
    'Cultivos',
    'Ganadería',
    'Maquinaria',
    'Plagas',
  ] as const;
  protected categoriaActiva: (typeof this.categorias)[number] = 'Todo';
  protected termino = '';
  protected formularioVisible = false;
  protected confirmacionVisible = false;
  protected mensajeFormulario = '';
  protected nuevoVideo: Omit<Video, 'id' | 'imagen'> = { categoria: 'Cultivos', titulo: '', descripcion: '', enlace: '' };

  protected videos: Video[] = [
    {
      id: 1,
      categoria: 'Cultivos',
      titulo: '¿Cuántas veces hay que abonar el maíz?',
      descripcion:
        'Consejos prácticos para planificar la fertilización y favorecer una cosecha sana de maíz.',
      imagen: 'maiz',
      enlace: 'https://www.youtube.com/results?search_query=cuantas+veces+abonar+maiz',
    },
    {
      id: 2,
      categoria: 'Cultivos',
      titulo: 'Recomendaciones para el cultivo óptimo de lechuga',
      descripcion: 'Aprende sobre clima, riego y nutrientes para obtener lechugas más vigorosas.',
      imagen: 'lechuga',
      enlace: 'https://www.youtube.com/results?search_query=cultivo+de+lechuga+recomendaciones',
    },
    {
      id: 3,
      categoria: 'Ganadería',
      titulo: 'Manejo responsable del ganado bovino',
      descripcion: 'Buenas prácticas para cuidar el bienestar y la productividad de tu hato.',
      imagen: 'ganado',
      enlace: 'https://www.youtube.com/results?search_query=manejo+de+ganado+bovino',
    },
    {
      id: 4,
      categoria: 'Plagas',
      titulo: 'Cómo identificar plagas en tus cultivos',
      descripcion: 'Señales tempranas y acciones preventivas para proteger tu siembra.',
      imagen: 'plagas',
      enlace: 'https://www.youtube.com/results?search_query=identificar+plagas+en+cultivos',
    },
  ];

  constructor(protected readonly autenticacion: AutenticacionService) {}

  ngOnInit(): void {
    this.cargarVideos();
  }

  protected get videosFiltrados(): Video[] {
    const termino = this.termino.trim().toLocaleLowerCase();
    return this.videos.filter(
      (video) =>
        (this.categoriaActiva === 'Todo' || video.categoria === this.categoriaActiva) &&
        (!termino ||
          `${video.titulo} ${video.descripcion} ${video.categoria}`
            .toLocaleLowerCase()
            .includes(termino)),
    );
  }

  protected seleccionarCategoria(categoria: (typeof this.categorias)[number]): void {
    this.categoriaActiva = categoria;
  }

  protected actualizarBusqueda(event: Event): void {
    this.termino = (event.target as HTMLInputElement).value;
  }

  protected abrirFormulario(): void {
    this.formularioVisible = true;
    this.mensajeFormulario = '';
  }

  protected revisarVideo(): void {
    if (!this.nuevoVideo.titulo.trim() || !this.nuevoVideo.descripcion.trim() || !this.nuevoVideo.enlace.trim()) {
      this.mensajeFormulario = 'Completa el título, la descripción y el enlace del video.';
      return;
    }
    this.confirmacionVisible = true;
  }

  protected publicarVideo(): void {
    this.videos = [{ ...this.nuevoVideo, id: Date.now(), imagen: 'custom' }, ...this.videos];
    this.guardarVideos();
    this.nuevoVideo = { categoria: 'Cultivos', titulo: '', descripcion: '', enlace: '' };
    this.confirmacionVisible = false;
    this.formularioVisible = false;
  }

  protected cancelarFormulario(): void {
    this.formularioVisible = false;
    this.confirmacionVisible = false;
    this.mensajeFormulario = '';
  }

  private cargarVideos(): void {
    const datosGuardados = localStorage.getItem(CLAVE_ALMACENAMIENTO);
    if (datosGuardados) {
      try {
        this.videos = JSON.parse(datosGuardados);
      } catch {
        // Si el JSON almacenado está corrupto, se conservan los videos por defecto.
      }
    } else {
      // Primera vez: se guardan los videos por defecto para que persistan desde el inicio.
      this.guardarVideos();
    }
  }

  private guardarVideos(): void {
    localStorage.setItem(CLAVE_ALMACENAMIENTO, JSON.stringify(this.videos));
  }
}