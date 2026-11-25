import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteFooterComponent } from '../../shared/site-footer/site-footer';
import { SiteHeaderComponent } from '../../shared/site-header/site-header';
import { ModulosService, mensajeApi } from '../../services/modulos';

interface Medicion { id: number; indicador: string; unidad: string; fecha: string; region: string; valor: number; fuente: string; }

@Component({
  selector: 'app-estadisticas-sector',
  imports: [CommonModule, SiteHeaderComponent, SiteFooterComponent],
  templateUrl: './estadisticas-sector.html',
  styleUrl: './estadisticas-sector.css',
})
export class EstadisticasSectorComponent implements OnInit {
  private readonly api = inject(ModulosService);
  protected readonly mediciones = signal<Medicion[]>([]);
  protected readonly cargando = signal(true);
  protected readonly error = signal('');

  ngOnInit(): void {
    this.api.listar<Medicion>('mediciones').subscribe({
      next: (datos) => { this.mediciones.set(datos); this.cargando.set(false); },
      error: (error) => { this.error.set(mensajeApi(error, 'No fue posible consultar las estadísticas.')); this.cargando.set(false); },
    });
  }
}
