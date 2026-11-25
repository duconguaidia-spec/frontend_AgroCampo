import { ChangeDetectorRef, Component, OnInit, inject, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { SiteFooterComponent } from '../../shared/site-footer/site-footer';
import { SiteHeaderComponent } from '../../shared/site-header/site-header';
import { AutenticacionService } from '../../services/autenticacion';
import { ImagenesService } from '../../services/imagenes';
import { mensajeApi } from '../../services/modulos';

interface Perfil {
  nombre: string;
  apellido: string;
  telefono: string;
  ubicacion: string;
  rol: string;
  foto: string | null;
}


@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [FormsModule, SiteHeaderComponent, SiteFooterComponent],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})
export class PerfilComponent implements OnInit {
  private readonly auth = inject(AutenticacionService);
  private readonly imagenes = inject(ImagenesService);
  private readonly cambios = inject(ChangeDetectorRef);
  protected readonly error = signal('');
  protected readonly cargando = signal(true);
  protected readonly disponible = signal(false);
  protected readonly subiendo = signal(false);
  protected readonly guardando = signal(false);
  protected perfil: Perfil = {
    nombre: '', apellido: '', telefono: '', ubicacion: '', rol: '',
    foto: null,
  };

  protected readonly intereses = ['Maíz', 'Trigo', 'Ganado bovino', 'Irrigación', 'Agricultura sostenible', 'Plagas'];
  protected interesesActivos = new Set<string>();
  protected guardado = false;

  ngOnInit(): void {
    this.cargarPerfil();
  }

  protected get iniciales(): string {
    return `${this.perfil.nombre.charAt(0)}${this.perfil.apellido.charAt(0)}`.toUpperCase();
  }

  protected alternarInteres(interes: string): void {
    this.interesesActivos.has(interes) ? this.interesesActivos.delete(interes) : this.interesesActivos.add(interes);
    this.guardado = false;
  }

  protected onFotoSeleccionada(event: Event): void {
    const input = event.target as HTMLInputElement;
    const archivo = input.files?.[0];
    input.value = '';
    if (!archivo || this.subiendo() || this.guardando()) return;
    this.subiendo.set(true);
    this.error.set('');
    this.imagenes.subir(archivo).pipe(finalize(() => this.subiendo.set(false))).subscribe({
      next: (url) => { this.perfil.foto = url; this.guardado = false; },
      error: (error) => this.error.set(error.message),
    });
  }

  private cargarPerfil(): void {
    this.auth.obtenerPerfil().pipe(finalize(() => this.cargando.set(false))).subscribe({
      next: (perfil) => {
        this.perfil = { ...perfil, foto: perfil.foto || null };
        this.interesesActivos = new Set(perfil.intereses);
        this.disponible.set(true);
      },
      error: (error) => this.error.set(mensajeApi(error, 'No fue posible cargar tu perfil.')),
    });
  }

  protected guardar(): void {
    if (this.guardando() || this.subiendo() || !this.disponible()) return;
    this.error.set('');
    this.guardado = false;
    this.guardando.set(true);
    this.auth.guardarPerfil({ ...this.perfil, foto: this.perfil.foto ?? '', intereses: [...this.interesesActivos] }).pipe(
      finalize(() => { this.guardando.set(false); this.cambios.markForCheck(); }),
    ).subscribe({
      next: () => { this.guardado = true; },
      error: (error) => this.error.set(mensajeApi(error, 'No fue posible guardar el perfil.')),
    });
  }
  protected mostrarModalFoto = false;

  protected abrirModalFoto(): void {
    if (this.perfil.foto) {
      this.mostrarModalFoto = true;
    }
  }

  protected cerrarModalFoto(): void {
    this.mostrarModalFoto = false;
  }
}
