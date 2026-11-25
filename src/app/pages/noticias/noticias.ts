import { ChangeDetectorRef, Component, OnInit, inject, signal } from '@angular/core';
import { finalize, forkJoin } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SiteFooterComponent } from '../../shared/site-footer/site-footer';
import { SiteHeaderComponent } from '../../shared/site-header/site-header';
import { AutenticacionService } from '../../services/autenticacion';
import { CategoriaApi, ModulosService, NoticiaApi, mensajeApi } from '../../services/modulos';
import { ImagenesService } from '../../services/imagenes';

interface Noticia {
  id: number;
  categoria: string;
  fecha: string;
  titulo: string;
  resumen: string;
  fuente: string;
  imagen: string;
}


@Component({
  selector: 'app-noticias',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, SiteHeaderComponent, SiteFooterComponent],
  templateUrl: './noticias.html',
  styleUrl: './noticias.css',
})
export class NoticiasComponent implements OnInit {
  private readonly api = inject(ModulosService);
  private readonly imagenes = inject(ImagenesService);
  private readonly cambios = inject(ChangeDetectorRef);
  private catalogo: CategoriaApi[] = [];
  protected categorias: string[] = [];
  protected readonly seleccionadas = new Set(this.categorias);
  protected termino = '';
  protected formularioVisible = false;
  protected mensajeFormulario = '';
  protected readonly subiendo = signal(false);
  protected readonly publicando = signal(false);
  protected readonly errorCarga = signal('');
  protected nuevaNoticia = this.crearFormularioVacio();

  protected noticias: Noticia[] = [];

  constructor(protected readonly autenticacion: AutenticacionService) {}

  ngOnInit(): void {
    this.cargarNoticias();
  }

  protected get noticiasFiltradas(): Noticia[] {
    const termino = this.normalizar(this.termino);
    return this.noticias.filter((noticia) => this.seleccionadas.has(noticia.categoria) && (!termino || this.normalizar(`${noticia.titulo} ${noticia.resumen} ${noticia.categoria}`).includes(termino)));
  }

  protected toggleCategoria(categoria: string): void {
    this.seleccionadas.has(categoria) ? this.seleccionadas.delete(categoria) : this.seleccionadas.add(categoria);
  }

  protected actualizarBusqueda(event: Event): void {
    this.termino = (event.target as HTMLInputElement).value;
  }

  protected abrirFormulario(): void {
    this.formularioVisible = true;
    this.mensajeFormulario = '';
  }

  protected cancelarFormulario(): void {
    if (this.subiendo()) return;
    this.formularioVisible = false;
    this.nuevaNoticia = this.crearFormularioVacio();
  }

  protected cargarImagen(event: Event): void {
    const input = event.target as HTMLInputElement;
    const archivo = input.files?.[0];
    input.value = '';
    if (!archivo || this.subiendo()) return;
    this.subiendo.set(true);
    this.mensajeFormulario = '';
    this.imagenes.subir(archivo).pipe(finalize(() => this.subiendo.set(false))).subscribe({
      next: (url) => this.nuevaNoticia.imagen = url,
      error: (error) => this.mensajeFormulario = error.message,
    });
  }

  protected agregarNoticia(): void {
    const noticia = this.nuevaNoticia;
    if (this.publicando() || this.subiendo()) return;
    const fecha = new Date(noticia.fecha);
    if (!noticia.titulo.trim() || !noticia.resumen.trim() || !Number.isFinite(fecha.getTime()) || !noticia.fuente.trim()) {
      this.mensajeFormulario = 'Completa el título, la descripción, la fecha y la fuente.';
      return;
    }

    const categoria = this.catalogo.find((item) => item.nombre === noticia.categoria);
    if (!categoria) { this.mensajeFormulario = 'Selecciona una categoría disponible.'; return; }
    this.publicando.set(true);
    this.api.crear<NoticiaApi>('noticias', { categoria_id: categoria.id, titulo: noticia.titulo.trim(), resumen: noticia.resumen.trim(), fuente: noticia.fuente.trim(), imagen_url: noticia.imagen, publicada_en: fecha.toISOString() }).pipe(
      finalize(() => this.publicando.set(false)),
    ).subscribe({
      next: (guardada) => { this.noticias = [this.convertir(guardada), ...this.noticias]; this.seleccionadas.add(categoria.nombre); this.cancelarFormulario(); },
      error: (error) => this.mensajeFormulario = mensajeApi(error, 'No fue posible publicar la noticia.'),
    });
  }

  private crearFormularioVacio(): Omit<Noticia, 'id'> {
    return { categoria: this.categorias[0] ?? '', fecha: '', titulo: '', resumen: '', fuente: '', imagen: '' };
  }

  private normalizar(valor: string): string {
    return valor.trim().toLocaleLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  private cargarNoticias(): void {
    forkJoin({ catalogo: this.api.listar<CategoriaApi>('categorias-noticias'), noticias: this.api.listar<NoticiaApi>('noticias') }).subscribe({
      next: ({ catalogo, noticias }) => {
        this.catalogo = catalogo;
        this.categorias = [...new Set([...catalogo.map((item) => item.nombre), 'Sin categoría'])];
        this.categorias.forEach((nombre) => this.seleccionadas.add(nombre));
        this.nuevaNoticia = this.crearFormularioVacio();
        this.noticias = noticias.sort((a, b) => (b.publicada_en ?? '').localeCompare(a.publicada_en ?? '') || b.id - a.id).map((item) => this.convertir(item));
        this.cambios.markForCheck();
      },
      error: (error) => this.errorCarga.set(mensajeApi(error, 'No fue posible cargar las noticias.')),
    });
  }

  private convertir(item: NoticiaApi): Noticia {
    const fecha = item.publicada_en || item.fecha_creacion;
    return { id: item.id, categoria: this.catalogo.find((c) => c.id === item.categoria_id)?.nombre ?? 'Sin categoría',
      fecha: fecha ? new Date(fecha).toLocaleDateString('es-CO', { timeZone: 'UTC' }) : '', titulo: item.titulo,
      resumen: item.resumen, fuente: item.fuente ?? '', imagen: item.imagen_url || 'assets/images/campo_verde.jpg' };
  }
}
