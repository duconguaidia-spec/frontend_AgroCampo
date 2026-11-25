import { ChangeDetectorRef, Component, OnInit, computed, inject } from '@angular/core';
import { finalize } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SiteFooterComponent } from '../../shared/site-footer/site-footer';
import { SiteHeaderComponent } from '../../shared/site-header/site-header';
import { AutenticacionService } from '../../services/autenticacion';
import { ProductoVeterinaria, VeterinariasService } from '../../services/veterinarias';

@Component({
  selector: 'app-veterinaria-detalle',
  standalone: true,
  imports: [FormsModule, RouterLink, SiteHeaderComponent, SiteFooterComponent],
  templateUrl: './veterinaria-detalle.html',
  styleUrl: './veterinaria-detalle.css',
})
export class VeterinariaDetalleComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly changeDetector = inject(ChangeDetectorRef);
  private readonly veterinariasService = inject(VeterinariasService);
  protected readonly autenticacion = inject(AutenticacionService);
  protected termino = '';
  protected editando = false;
  protected mensaje = '';
  protected cargando = true;
  protected errorCarga = '';
  protected errorGuardado = '';
  protected guardando = false;
  protected subiendoImagen = false;
  protected productoEnEdicion: number | null = null;
  protected formularioProducto = this.productoVacio();
  private readonly id = this.route.snapshot.paramMap.get('id') ?? '';
  protected readonly veterinaria = computed(() => this.veterinariasService.veterinarias().find((item) => item.id === this.id) ?? this.veterinariaVacia());
  protected borrador = this.datosBorrador();

  ngOnInit(): void {
    this.veterinariasService.obtenerDetalle(this.id).subscribe({
      next: () => { this.cargando = false; this.borrador = this.datosBorrador(); },
      error: (error: { error?: { message?: string }; message?: string }) => {
        this.cargando = false;
        this.errorCarga = error.error?.message || error.message || 'No fue posible cargar el detalle de la veterinaria desde el MID.';
      },
    });
  }

  protected get productosFiltrados(): ProductoVeterinaria[] {
    const termino = this.termino.trim().toLocaleLowerCase();
    return this.veterinaria().productos.filter((producto) => !termino || `${producto.nombre} ${producto.descripcion}`.toLocaleLowerCase().includes(termino));
  }

  protected buscar(event: Event): void {
    this.termino = (event.target as HTMLInputElement).value;
  }

  protected abrirEdicion(): void {
    this.borrador = this.datosBorrador();
    this.editando = true;
    this.mensaje = '';
  }

  protected guardarInformacion(): void {
    if (this.guardando) return;
    this.iniciarGuardado();
    this.veterinariasService.actualizar(this.id, { ...this.borrador }).subscribe({
      next: () => {
        this.guardando = false;
        this.mensaje = 'La información de la veterinaria se actualizó correctamente.';
        this.editando = false;
      },
      error: (error) => this.mostrarErrorGuardado(error),
    });
  }

  protected cancelarEdicion(): void {
    this.editando = false;
    this.borrador = this.datosBorrador();
  }

  protected editarProducto(producto: ProductoVeterinaria): void {
    if (this.guardando || this.subiendoImagen) return;
    this.productoEnEdicion = producto.id;
    this.formularioProducto = { ...producto };
  }

  protected guardarProducto(): void {
    if (this.guardando || this.subiendoImagen || !this.formularioProducto.nombre.trim() || !this.formularioProducto.descripcion.trim()) return;
    this.iniciarGuardado();
    this.veterinariasService.guardarProducto(this.id, { ...this.formularioProducto }).subscribe({
      next: () => {
        this.guardando = false;
        this.formularioProducto = this.productoVacio();
        this.productoEnEdicion = null;
        this.mensaje = 'El producto se guardó correctamente.';
      },
      error: (error) => this.mostrarErrorGuardado(error),
    });
  }

  protected eliminarVeterinaria(): void {
    if (this.guardando || this.subiendoImagen || !window.confirm(`¿Eliminar la veterinaria "${this.veterinaria().nombre}" y sus productos y servicios? Esta acción no se puede deshacer.`)) return;
    this.iniciarGuardado();
    this.veterinariasService.eliminar(this.id).subscribe({
      next: () => { this.guardando = false; void this.router.navigate(['/veterinarias']); },
      error: (error) => this.mostrarErrorGuardado(error),
    });
  }

  protected subirImagenProducto(event: Event): void {
    const input = event.target as HTMLInputElement;
    const archivo = input.files?.[0];
    input.value = '';
    if (!archivo) return;
    if (!['image/png', 'image/jpeg', 'image/gif'].includes(archivo.type) || archivo.size > 2 * 1024 * 1024) {
      this.errorGuardado = 'Selecciona una imagen PNG, JPG o GIF de máximo 2 MB.';
      return;
    }
    this.subiendoImagen = true;
    this.errorGuardado = '';
    this.veterinariasService.subirImagen(archivo).pipe(finalize(() => {
      this.subiendoImagen = false;
      this.changeDetector.markForCheck();
    })).subscribe({
      next: (url) => { this.formularioProducto.imagenUrl = url; },
      error: (error) => { this.mostrarErrorGuardado(error); },
    });
  }

  protected eliminarProducto(idProducto: number): void {
    if (this.guardando) return;
    this.iniciarGuardado();
    this.veterinariasService.eliminarProducto(this.id, idProducto).subscribe({
      next: () => {
        this.guardando = false;
        if (this.productoEnEdicion === idProducto) this.cancelarProducto();
        this.mensaje = 'El producto se eliminó correctamente.';
      },
      error: (error) => this.mostrarErrorGuardado(error),
    });
  }

  private iniciarGuardado(): void {
    this.guardando = true;
    this.mensaje = '';
    this.errorGuardado = '';
  }

  private mostrarErrorGuardado(error: { error?: { message?: string }; message?: string }): void {
    this.guardando = false;
    this.errorGuardado = error.error?.message || error.message || 'No fue posible guardar los cambios.';
  }

  protected cancelarProducto(): void {
    if (this.guardando || this.subiendoImagen) return;
    this.productoEnEdicion = null;
    this.formularioProducto = this.productoVacio();
  }

  private datosBorrador() {
    const veterinaria = this.veterinaria();
    return { nombre: veterinaria.nombre, descripcion: veterinaria.descripcion, direccion: veterinaria.direccion, telefono: veterinaria.telefono, horarios: veterinaria.horarios };
  }

  private veterinariaVacia() {
    return { id: this.id, nombre: 'Veterinaria', ciudad: '', distancia: '', servicios: [], telefono: '', direccion: '', descripcion: '', horarios: '', color: '#2a8b5a', productos: [] };
  }

  private productoVacio(): ProductoVeterinaria {
    return { id: 0, nombre: '', descripcion: '', estilo: 'custom' };
  }
}
