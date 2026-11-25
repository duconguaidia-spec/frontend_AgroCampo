import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SiteFooterComponent } from '../../shared/site-footer/site-footer';
import { SiteHeaderComponent } from '../../shared/site-header/site-header';
import { ModulosService, NoticiaApi, mensajeApi } from '../../services/modulos';

@Component({
  selector: 'app-noticia-detalle',
  imports: [RouterLink, SiteHeaderComponent, SiteFooterComponent],
  templateUrl: './noticia-detalle.html',
  styleUrl: './noticia-detalle.css',
})
export class NoticiaDetalleComponent {
  private readonly api = inject(ModulosService);
  protected readonly noticia = signal<NoticiaApi | null>(null);
  protected readonly error = signal('');

  constructor() {
    inject(ActivatedRoute).paramMap.pipe(
      switchMap((params) => this.api.obtener<NoticiaApi>('noticias', params.get('id') ?? '0')),
      takeUntilDestroyed(),
    ).subscribe({
      next: (noticia) => this.noticia.set(noticia),
      error: (error) => this.error.set(mensajeApi(error, 'No fue posible consultar la noticia.')),
    });
  }
}
