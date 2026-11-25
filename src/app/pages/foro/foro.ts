import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize, forkJoin } from 'rxjs';
import { SiteFooterComponent } from '../../shared/site-footer/site-footer';
import { SiteHeaderComponent } from '../../shared/site-header/site-header';
import { CategoriaApi, ModulosService, mensajeApi } from '../../services/modulos';
import { AutenticacionService } from '../../services/autenticacion';

interface TemaApi { id: number; titulo: string; descripcion: string; categoria_id: number; activo: boolean; vistas: number; urgente: boolean; autor_id: number; autor?: string; }
interface RespuestaApi { tema_id: number; activo: boolean; }

@Component({
  selector: 'app-foro',
  imports: [CommonModule, FormsModule, SiteHeaderComponent, SiteFooterComponent],
  templateUrl: './foro.html',
  styleUrl: './foro.css',
})
export class ForoComponent implements OnInit {
  private readonly api = inject(ModulosService);
  private readonly auth = inject(AutenticacionService);
  private readonly catalogo = signal<CategoriaApi[]>([]);
  private readonly temas = signal<TemaApi[]>([]);
  private readonly respuestas = signal<RespuestaApi[]>([]);
  private readonly guardados = signal<number[]>([]);
  protected readonly errorApi = signal('');
  protected readonly guardando = signal(false);
  protected readonly tiposPublicacion = computed(() => this.catalogo().map((item) => item.nombre));
  protected readonly categoriasApi = computed(() => ['Todo', ...this.tiposPublicacion()]);
  protected readonly publicaciones = computed(() => this.temas().map((tema) => ({
    id: tema.id, titulo: tema.titulo, resumen: tema.descripcion, autor: tema.autor ?? 'Comunidad AgroCampo',
    rol: '', respuestas: this.respuestas().filter((r) => r.activo && r.tema_id === tema.id).length,
    vistas: tema.vistas, urgente: tema.urgente, guardado: this.guardados().includes(tema.id),
    categoria: this.catalogo().find((item) => item.id === tema.categoria_id)?.nombre ?? 'Sin categoría',
  })));
  protected categoriaActiva = 'Todo';
  protected busqueda = '';
  protected publicarAbierto = false;
  protected nuevoTitulo = '';
  protected nuevaCategoria = '';
  protected nuevaDescripcion = '';

  get categorias(): string[] { return this.categoriasApi(); }

  ngOnInit(): void {
    forkJoin({
      categorias: this.api.listar<CategoriaApi>('categorias-contenido'),
      temas: this.api.listar<TemaApi>('temas'),
      respuestas: this.api.listar<RespuestaApi>('respuestas'),
      guardados: this.api.listar<number>('temas-guardados'),
    }).subscribe({
      next: ({ categorias, temas, respuestas, guardados }) => {
        this.catalogo.set(categorias.filter((item) => item.activo && item.tipo === 'foro'));
        this.nuevaCategoria = this.tiposPublicacion()[0] ?? '';
        this.temas.set(temas.filter((tema) => tema.activo));
        this.respuestas.set(respuestas);
        this.guardados.set(guardados);
      },
      error: (error) => this.errorApi.set(mensajeApi(error, 'No fue posible cargar el foro.')),
    });
  }

  get publicacionesFiltradas() {
    const termino = this.busqueda.trim().toLowerCase();
    return this.publicaciones().filter((post) => (this.categoriaActiva === 'Todo' || post.categoria === this.categoriaActiva)
      && `${post.titulo} ${post.resumen} ${post.categoria}`.toLowerCase().includes(termino));
  }

  seleccionarCategoria(categoria: string): void { this.categoriaActiva = categoria; }
  actualizarBusqueda(event: Event): void { this.busqueda = (event.target as HTMLInputElement).value; }

  alternarGuardado(post: { id: number; guardado: boolean }): void {
    if (this.guardando()) return;
    this.guardando.set(true);
    this.errorApi.set('');
    this.api.crear<number[]>('temas-guardados', { tema_id: post.id, guardado: !post.guardado })
      .pipe(finalize(() => this.guardando.set(false))).subscribe({
        next: (ids) => this.guardados.set(ids),
        error: (error) => this.errorApi.set(mensajeApi(error, 'No fue posible actualizar tus temas guardados.')),
      });
  }

  crearPublicacion(): void {
    if (this.guardando()) return;
    const titulo = this.nuevoTitulo.trim();
    const descripcion = this.nuevaDescripcion.trim();
    const categoria = this.catalogo().find((item) => item.nombre === this.nuevaCategoria);
    if (!titulo || !descripcion || !categoria) { this.errorApi.set('Completa el título, la categoría y la descripción.'); return; }
    this.guardando.set(true);
    this.errorApi.set('');
    this.api.crear<TemaApi>('temas', { titulo, descripcion, categoria_id: categoria.id })
      .pipe(finalize(() => this.guardando.set(false))).subscribe({
        next: (tema) => {
          this.temas.update((items) => [{ ...tema, autor: this.auth.usuario()?.nombre }, ...items]);
          this.cerrarFormulario();
        },
        error: (error) => this.errorApi.set(mensajeApi(error, 'No fue posible publicar el tema.')),
      });
  }

  cerrarFormulario(): void {
    this.nuevoTitulo = '';
    this.nuevaDescripcion = '';
    this.nuevaCategoria = this.tiposPublicacion()[0] ?? '';
    this.publicarAbierto = false;
  }
}
