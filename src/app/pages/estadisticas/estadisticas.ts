import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize, forkJoin } from 'rxjs';
import { SiteFooterComponent } from '../../shared/site-footer/site-footer';
import { SiteHeaderComponent } from '../../shared/site-header/site-header';
import { AutenticacionService } from '../../services/autenticacion';
import { CategoriaApi, ModulosService, mensajeApi } from '../../services/modulos';

interface SubastaApi { id: number; fecha_subasta: string; nombre?: string; activo: boolean; }
interface PrecioApi { subasta_id: number; categoria_ganado_id: number; precio_por_kg: number; activo: boolean; }
const colores = ['#69707a', '#9b6b48', '#ef8a29', '#2672ad', '#6372d8', '#df8d58', '#77702b'];

@Component({
  selector: 'app-estadisticas',
  imports: [CommonModule, FormsModule, RouterLink, SiteHeaderComponent, SiteFooterComponent],
  templateUrl: './estadisticas.html',
  styleUrl: './estadisticas.css',
})
export class EstadisticasComponent implements OnInit {
  protected readonly autenticacion = inject(AutenticacionService);
  private readonly api = inject(ModulosService);
  private readonly catalogo = signal<CategoriaApi[]>([]);
  private readonly registros = signal<SubastaApi[]>([]);
  private readonly precios = signal<PrecioApi[]>([]);
  protected readonly error = signal('');
  protected readonly exportMessage = signal('');
  protected readonly mensajeActualizacion = signal('');
  protected readonly guardando = signal(false);
  protected readonly exportando = signal(false);
  protected subastaSeleccionada = 0;
  protected categoriaSeleccionada = 0;
  protected nuevoValor: number | null = null;
  protected readonly categorias = computed(() => this.catalogo().map((c, i) => ({ id: c.id, sigla: c.nombre, color: colores[i % colores.length] })));
  protected readonly subastas = computed(() => this.registros().slice(0, 4).map((s) => ({
    id: s.id, fecha: s.fecha_subasta.slice(0, 10), nombre: s.nombre,
    valores: this.categorias().map((c) => this.precios().find((p) => p.subasta_id === s.id && p.categoria_ganado_id === c.id)?.precio_por_kg ?? null),
  })));
  protected readonly valores = computed(() => this.subastas().flatMap((s) => s.valores).filter((valor): valor is number => valor !== null));
  protected readonly promedio = computed(() => this.valores().length ? this.valores().reduce((a, b) => a + b, 0) / this.valores().length : null);
  protected readonly mayor = computed(() => this.valores().length ? Math.max(...this.valores()) : null);
  protected readonly maximo = computed(() => Math.max(1000, Math.ceil((this.mayor() ?? 0) / 1000) * 1000));

  ngOnInit(): void { this.cargar(); }

  private cargar(): void {
    forkJoin({
      categorias: this.api.listar<CategoriaApi>('categorias-ganado'),
      subastas: this.api.listar<SubastaApi>('subastas'),
      precios: this.api.listar<PrecioApi>('precios-ganado'),
    }).subscribe({
      next: ({ categorias, subastas, precios }) => {
        this.error.set('');
        this.catalogo.set(categorias.filter((c) => c.activo));
        this.registros.set(subastas.filter((s) => s.activo).sort((a, b) => b.fecha_subasta.localeCompare(a.fecha_subasta) || b.id - a.id));
        this.precios.set(precios.filter((p) => p.activo));
        this.subastaSeleccionada ||= this.subastas()[0]?.id ?? 0;
        this.categoriaSeleccionada ||= this.categorias()[0]?.id ?? 0;
      },
      error: (error) => this.error.set(mensajeApi(error, 'No fue posible cargar las cotizaciones.')),
    });
  }

  protected exportar(formato: 'pdf' | 'xlsx'): void {
    if (this.exportando()) return;
    this.exportando.set(true);
    this.exportMessage.set('');
    this.api.crear<{ id: number }>('reportes', { formato }).pipe(finalize(() => this.exportando.set(false))).subscribe({
      next: ({ id }) => this.exportMessage.set(`Reporte #${id} listo. Puedes descargarlo en Mis reportes.`),
      error: (error) => this.exportMessage.set(mensajeApi(error, 'No fue posible registrar el reporte.')),
    });
  }

  protected actualizarEstadistica(): void {
    if (this.guardando()) return;
    if (!this.nuevoValor || !Number.isFinite(this.nuevoValor) || this.nuevoValor <= 0 || !this.subastaSeleccionada || !this.categoriaSeleccionada) {
      this.mensajeActualizacion.set('Selecciona una subasta, una categoría y un valor mayor que cero.');
      return;
    }
    this.guardando.set(true);
    this.mensajeActualizacion.set('');
    this.api.crear('precios-ganado', { subasta_id: this.subastaSeleccionada, categoria_ganado_id: this.categoriaSeleccionada, precio_por_kg: this.nuevoValor })
      .pipe(finalize(() => this.guardando.set(false))).subscribe({
        next: () => { this.mensajeActualizacion.set('Cotización actualizada.'); this.cargar(); },
        error: (error) => this.mensajeActualizacion.set(mensajeApi(error, 'No fue posible actualizar la cotización.')),
      });
  }
}
