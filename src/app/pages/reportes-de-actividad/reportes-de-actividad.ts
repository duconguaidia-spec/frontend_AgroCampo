import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SiteHeaderComponent } from '../../shared/site-header/site-header';
import { SiteFooterComponent } from '../../shared/site-footer/site-footer';
import { ModulosService, ReporteApi, mensajeApi } from '../../services/modulos';

@Component({
  selector: 'app-reportes-de-actividad',
  imports: [RouterLink, SiteHeaderComponent, SiteFooterComponent],
  templateUrl: './reportes-de-actividad.html',
  styleUrl: './reportes-de-actividad.css',
})
export class ReportesDeActividad implements OnInit {
  private readonly api = inject(ModulosService);
  protected readonly reportes = signal<ReporteApi[]>([]);
  protected readonly cargando = signal(true);
  protected readonly error = signal('');

  ngOnInit(): void {
    this.api.listar<ReporteApi>('reportes').subscribe({
      next: (datos) => { this.reportes.set(datos.sort((a, b) => b.id - a.id)); this.cargando.set(false); },
      error: (error) => { this.error.set(mensajeApi(error, 'No fue posible consultar tus reportes.')); this.cargando.set(false); },
    });
  }
}
