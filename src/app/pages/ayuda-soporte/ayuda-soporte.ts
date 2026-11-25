import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { SiteFooterComponent } from '../../shared/site-footer/site-footer';
import { SiteHeaderComponent } from '../../shared/site-header/site-header';
import { ModulosService, mensajeApi } from '../../services/modulos';

interface PreguntaApi { id: number; pregunta: string; respuesta: string; activo: boolean; }
interface PreguntaFrecuente { titulo: string; respuesta: string; }

@Component({
  selector: 'app-ayuda-soporte',
  imports: [CommonModule, FormsModule, SiteHeaderComponent, SiteFooterComponent],
  templateUrl: './ayuda-soporte.html',
  styleUrl: './ayuda-soporte.css',
})
export class AyudaSoporteComponent implements OnInit {
  private readonly api = inject(ModulosService);
  protected busqueda = '';
  protected reporteAbierto = false;
  protected descripcion = '';
  protected preguntaActiva?: PreguntaFrecuente;
  protected readonly enviando = signal(false);
  protected readonly numeroReporte = signal<number | null>(null);
  protected readonly errorApi = signal('');
  private readonly preguntas = signal<PreguntaFrecuente[]>([]);

  ngOnInit(): void {
    this.api.listar<PreguntaApi>('preguntas').subscribe({
      next: (items) => this.preguntas.set(items.filter((item) => item.activo).map((item) => ({ titulo: item.pregunta, respuesta: item.respuesta }))),
      error: (error) => this.errorApi.set(mensajeApi(error, 'No fue posible consultar las preguntas frecuentes.')),
    });
  }

  get preguntasFiltradas(): PreguntaFrecuente[] {
    const termino = this.busqueda.trim().toLowerCase();
    return this.preguntas().filter((item) => `${item.titulo} ${item.respuesta}`.toLowerCase().includes(termino));
  }

  buscar(event: Event): void { this.busqueda = (event.target as HTMLInputElement).value; }
  seleccionar(pregunta: PreguntaFrecuente): void { this.preguntaActiva = pregunta; }
  get reporteEnviado(): boolean { return this.numeroReporte() !== null; }
  set reporteEnviado(valor: boolean) { if (!valor) this.numeroReporte.set(null); }

  enviarReporte(): void {
    if (this.enviando() || !this.descripcion.trim()) return;
    this.enviando.set(true);
    this.errorApi.set('');
    this.api.crear<{ id: number }>('tickets', { descripcion: this.descripcion.trim() }).pipe(
      finalize(() => this.enviando.set(false)),
    ).subscribe({
      next: ({ id }) => { this.numeroReporte.set(id); this.reporteAbierto = false; this.descripcion = ''; },
      error: (error) => this.errorApi.set(mensajeApi(error, 'No fue posible enviar el reporte.')),
    });
  }
}
