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
type EdicionTema = Pick<TemaApi, 'titulo' | 'descripcion' | 'categoria_id'>;

@Component({
  selector: 'app-foro',
  imports: [CommonModule, FormsModule, SiteHeaderComponent, SiteFooterComponent],
  templateUrl: './foro.html',
  styleUrl: './foro.css',
})
export class ForoComponent implements OnInit {
  private readonly api = inject(ModulosService);
  protected readonly auth = inject(AutenticacionService);
  protected readonly catalogo = signal<CategoriaApi[]>([]);
  private readonly temas = signal<TemaApi[]>([]);
  private readonly respuestas = signal<RespuestaApi[]>([]);
  private readonly guardados = signal<number[]>([]);
  protected readonly errorApi = signal('');
  protected readonly errorFormulario = signal('');
  protected readonly mensaje = signal('');
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
  protected temaEditando: number | null = null;
  protected nuevoTitulo = '';
  protected nuevaCategoria: number | null = null;
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
        this.nuevaCategoria = this.catalogo()[0]?.id ?? null;
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

  abrirPublicacion(): void {
    if (this.guardando()) return;
    this.cerrarFormulario();
    this.mensaje.set('');
    this.publicarAbierto = true;
  }

  abrirEdicion(id: number): void {
    if (this.guardando() || !this.auth.puedeGestionarContenido()) return;
    const tema = this.temas().find((item) => item.id === id);
    if (!tema) return;
    this.cerrarFormulario();
    this.mensaje.set('');
    this.temaEditando = id;
    this.nuevoTitulo = tema.titulo;
    this.nuevaDescripcion = tema.descripcion;
    this.nuevaCategoria = this.catalogo().some((item) => item.id === tema.categoria_id) ? tema.categoria_id : null;
  }

  guardarPublicacion(): void {
    if (this.guardando()) return;
    const id = this.temaEditando;
    if (id !== null && !this.auth.puedeGestionarContenido()) return;
    const titulo = this.nuevoTitulo.trim();
    const descripcion = this.nuevaDescripcion.trim();
    const categoria = this.catalogo().find((item) => item.id === this.nuevaCategoria);
    if (!titulo || !descripcion || !categoria) {
      this.errorFormulario.set('Completa el título, la categoría y la descripción.');
      return;
    }
    this.guardando.set(true);
    this.errorFormulario.set('');
    const datos: EdicionTema = { titulo, descripcion, categoria_id: categoria.id };
    if (id !== null) {
      this.api.actualizar<EdicionTema>('temas', id, datos)
        .pipe(finalize(() => this.guardando.set(false))).subscribe({
          next: (cambios) => {
            this.temas.update((items) => items.map((tema) => tema.id === id ? { ...tema, ...cambios } : tema));
            this.cerrarFormulario();
            this.mensaje.set('El tema se actualizó correctamente.');
          },
          error: (error) => this.errorFormulario.set(mensajeApi(error, 'No fue posible actualizar el tema.')),
        });
      return;
    }
    this.api.crear<TemaApi>('temas', datos)
      .pipe(finalize(() => this.guardando.set(false))).subscribe({
        next: (tema) => {
          this.temas.update((items) => [{ ...tema, autor: this.auth.usuario()?.nombre }, ...items]);
          this.cerrarFormulario();
        },
        error: (error) => this.errorFormulario.set(mensajeApi(error, 'No fue posible publicar el tema.')),
      });
  }

  cerrarFormulario(): void {
    this.nuevoTitulo = '';
    this.nuevaDescripcion = '';
    this.nuevaCategoria = this.catalogo()[0]?.id ?? null;
    this.publicarAbierto = false;
    this.temaEditando = null;
    this.errorFormulario.set('');
  }
}
