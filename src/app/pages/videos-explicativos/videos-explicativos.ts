import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize, forkJoin } from 'rxjs';
import { SiteFooterComponent } from '../../shared/site-footer/site-footer';
import { SiteHeaderComponent } from '../../shared/site-header/site-header';
import { AutenticacionService } from '../../services/autenticacion';
import { CategoriaApi, ModulosService, mensajeApi } from '../../services/modulos';

interface VideoApi { id: number; categoria_id?: number; titulo: string; descripcion?: string; url_video: string; imagen_url?: string; activo: boolean; }

@Component({
  selector: 'app-videos-explicativos',
  imports: [CommonModule, FormsModule, SiteHeaderComponent, SiteFooterComponent],
  templateUrl: './videos-explicativos.html',
  styleUrl: './videos-explicativos.css',
})
export class VideosExplicativosComponent implements OnInit {
  private readonly api = inject(ModulosService);
  protected readonly autenticacion = inject(AutenticacionService);
  protected readonly catalogo = signal<CategoriaApi[]>([]);
  private readonly videos = signal<VideoApi[]>([]);
  protected readonly errorApi = signal('');
  protected readonly guardando = signal(false);
  protected categoriaActiva = 'Todo';
  protected termino = '';
  protected formularioVisible = false;
  protected confirmacionVisible = false;
  protected nuevoVideo = { categoria: '', titulo: '', descripcion: '', enlace: '' };

  get categorias(): string[] { return ['Todo', ...this.catalogo().map((item) => item.nombre)]; }

  ngOnInit(): void {
    forkJoin({ categorias: this.api.listar<CategoriaApi>('categorias-contenido'), videos: this.api.listar<VideoApi>('videos') }).subscribe({
      next: ({ categorias, videos }) => {
        this.catalogo.set(categorias.filter((item) => item.activo && item.tipo === 'video'));
        this.videos.set(videos.filter((item) => item.activo));
      },
      error: (error) => this.errorApi.set(mensajeApi(error, 'No fue posible cargar los videos.')),
    });
  }

  get videosFiltrados() {
    const termino = this.termino.trim().toLowerCase();
    return this.videos().map((item) => ({
      id: item.id, titulo: item.titulo, descripcion: item.descripcion ?? '', enlace: item.url_video,
      imagen: item.imagen_url ?? '', categoria: this.catalogo().find((cat) => cat.id === item.categoria_id)?.nombre ?? 'Sin categoría',
    })).filter((video) => (this.categoriaActiva === 'Todo' || video.categoria === this.categoriaActiva)
      && `${video.titulo} ${video.descripcion} ${video.categoria}`.toLowerCase().includes(termino));
  }

  seleccionarCategoria(categoria: string): void { this.categoriaActiva = categoria; }
  actualizarBusqueda(event: Event): void { this.termino = (event.target as HTMLInputElement).value; }

  abrirFormulario(): void {
    this.errorApi.set('');
    this.nuevoVideo.categoria ||= this.catalogo()[0]?.nombre ?? '';
    this.formularioVisible = true;
  }

  revisarVideo(): void {
    const { categoria, titulo, descripcion, enlace } = this.nuevoVideo;
    if (!categoria || !titulo.trim() || !descripcion.trim() || !/^https?:\/\//i.test(enlace.trim())) {
      this.errorApi.set('Selecciona una categoría y completa el título, la descripción y el enlace HTTP o HTTPS.');
      return;
    }
    this.errorApi.set('');
    this.confirmacionVisible = true;
  }

  publicarVideo(): void {
    if (this.guardando()) return;
    const { titulo, descripcion, enlace } = this.nuevoVideo;
    const categoria = this.catalogo().find((item) => item.nombre === this.nuevoVideo.categoria);
    if (!categoria) return;
    this.guardando.set(true);
    this.api.crear<VideoApi>('videos', { titulo: titulo.trim(), descripcion: descripcion.trim(), url_video: enlace.trim(), categoria_id: categoria.id })
      .pipe(finalize(() => this.guardando.set(false))).subscribe({
        next: (video) => { this.videos.update((items) => [video, ...items]); this.nuevoVideo = { categoria: '', titulo: '', descripcion: '', enlace: '' }; this.cancelarFormulario(); },
        error: (error) => { this.confirmacionVisible = false; this.errorApi.set(mensajeApi(error, 'No fue posible publicar el video.')); },
      });
  }

  cancelarFormulario(): void {
    this.formularioVisible = false;
    this.confirmacionVisible = false;
    this.errorApi.set('');
  }
}
