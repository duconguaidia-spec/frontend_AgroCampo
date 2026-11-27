import { ChangeDetectorRef, Component, ElementRef, ViewChild, inject, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SiteFooterComponent } from '../../shared/site-footer/site-footer';
import { SiteHeaderComponent } from '../../shared/site-header/site-header';
import { VeterinariasService } from '../../services/veterinarias';

interface ProductoServicio {
  id: number;
  nombre: string;
  descripcion?: string;
  imagen?: string;
  tipo: 'bravecto' | 'nexgard' | 'custom';
}

@Component({
  selector: 'app-agregar-veterinaria',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SiteHeaderComponent,
    SiteFooterComponent,
  ],
  templateUrl: './veterinaria_registrar.html',
  styleUrl: './veterinaria_registrar.css',
})
export class AgregarVeterinariaComponent {
  // Campos del formulario
  nombre = '';
  ubicacion = '';
  horarios = '';
  telefono = '';
  descripcion = '';
  especialidad = '';
  ciudad = '';
  // Campos para nuevo producto
  nuevoTitulo = '';
  nuevaDescripcion = '';
  nuevaImagen: string | null = null;

  // Estado de feedback
  mensajeExito = '';
  mostrarModal = false;
  private veterinariaRegistradaId = '';
  guardando = false;
  subiendoImagen = false;
  mensajeError = '';

  @ViewChild('tituloProducto') private tituloProducto?: ElementRef<HTMLInputElement>;

  productos = signal<ProductoServicio[]>([]);

  private readonly router = inject(Router);
  private readonly changeDetector = inject(ChangeDetectorRef);
  private readonly veterinariasService = inject(VeterinariasService);

  abrirGoogleMaps(): void {
    const query = this.ubicacion.trim() || 'Veterinarias Casanare';
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const archivo = input.files?.[0];
    input.value = '';
    if (!archivo || this.subiendoImagen) return;
    if (!['image/png', 'image/jpeg', 'image/gif'].includes(archivo.type) || archivo.size > 2 * 1024 * 1024) {
      this.mensajeError = 'Selecciona una imagen PNG, JPG o GIF de máximo 2 MB.';
      return;
    }
    this.subiendoImagen = true;
    this.mensajeError = '';
    this.veterinariasService.subirImagen(archivo).pipe(finalize(() => {
      this.subiendoImagen = false;
      this.changeDetector.markForCheck();
    })).subscribe({
      next: (url) => { this.nuevaImagen = url; },
      error: (error) => { this.mensajeError = error.error?.message || error.message || 'No fue posible subir la imagen.'; },
    });
  }

  agregarProducto(): void {
    if (this.subiendoImagen) return;
    const titulo = this.nuevoTitulo.trim();
    if (!titulo) {
      alert('Por favor escribe el título del producto antes de agregarlo.');
      return;
    }

    const nuevo: ProductoServicio = {
      id: Date.now(),
      nombre: titulo,
      descripcion: this.nuevaDescripcion.trim(),
      imagen: this.nuevaImagen || undefined,
      tipo: 'custom',
    };

    this.productos.update((items) => [...items, nuevo]);

    // Limpiar formulario de producto
    this.nuevoTitulo = '';
    this.nuevaDescripcion = '';
    this.nuevaImagen = null;
  }

  prepararNuevoProducto(): void {
    this.tituloProducto?.nativeElement.focus();
  }

  eliminarProducto(id: number): void {
    this.productos.update((items) => items.filter((p) => p.id !== id));
  }

  guardarVeterinaria(): void {
    if (this.guardando || this.subiendoImagen) return;
    if (!this.nombre.trim() || !this.ubicacion.trim() || !this.ciudad.trim() || !this.telefono.trim()) {
      this.mensajeError = 'Completa el nombre, la dirección, la ciudad y el teléfono.';
      return;
    }

    this.guardando = true;
    this.mensajeError = '';
    this.veterinariasService.crear({
      nombre: this.nombre.trim(),
      descripcion: this.descripcion.trim(),
      direccion: this.ubicacion.trim(),
      ciudad: this.ciudad.trim(),
      telefono: this.telefono.trim(),
      horario_atencion: this.horarios.trim(),
      productos: this.productos().map((producto) => ({
        nombre: producto.nombre.trim(),
        descripcion: producto.descripcion?.trim(),
        imagen_url: producto.imagen,
        precio: 0,
      })),
    }).subscribe({
      next: (veterinaria) => {
        this.guardando = false;
        this.veterinariaRegistradaId = veterinaria.id;
        this.mensajeExito = `¡La veterinaria "${veterinaria.nombre}" se ha registrado con éxito!`;
        this.mostrarModal = true;
      },
      error: (error: { error?: { message?: string }; message?: string }) => {
        this.guardando = false;
        this.mensajeError = error.error?.message || error.message || 'No fue posible registrar la veterinaria en el MID.';
      },
    });
  }

  cerrarModalYVolver(): void {
    this.mostrarModal = false;
    this.router.navigate(['/veterinarias']);
  }

  abrirVeterinariaRegistrada(): void {
    this.mostrarModal = false;
    void this.router.navigate(['/veterinarias', this.veterinariaRegistradaId]);
  }

}
