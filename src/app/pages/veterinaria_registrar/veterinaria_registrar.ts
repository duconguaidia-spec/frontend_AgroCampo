import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SiteFooterComponent } from '../../shared/site-footer/site-footer';
import { SiteHeaderComponent } from '../../shared/site-header/site-header';

export interface ProductoServicio {
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
    RouterLink,
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
  busqueda = '';

  // Campos para nuevo producto
  nuevoTitulo = '';
  nuevaDescripcion = '';
  nuevaImagen: string | null = null;

  // Estado de feedback
  mensajeExito = '';
  mostrarModal = false;

  // Productos iniciales según el mockup
  productos = signal<ProductoServicio[]>([
    {
      id: 1,
      nombre: 'Bravecto',
      descripcion: 'Tratamiento antipulgas y garrapatas',
      tipo: 'bravecto',
    },
    {
      id: 2,
      nombre: 'NexGard y NexGard Spectra',
      descripcion: 'Antiparasitario masticable',
      tipo: 'nexgard',
    },
  ]);

  constructor(private router: Router) {}

  abrirGoogleMaps(): void {
    const query = this.ubicacion.trim() || 'Veterinarias Casanare';
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.nuevaImagen = e.target?.result as string;
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  agregarProducto(): void {
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

  eliminarProducto(id: number): void {
    this.productos.update((items) => items.filter((p) => p.id !== id));
  }

  guardarVeterinaria(): void {
    if (!this.nombre.trim()) {
      alert('Por favor ingresa el nombre de la veterinaria.');
      return;
    }

    const datos = {
      nombre: this.nombre,
      ubicacion: this.ubicacion,
      horarios: this.horarios,
      telefono: this.telefono,
      descripcion: this.descripcion,
      especialidad: this.especialidad,
      productos: this.productos(),
    };

    console.log('Veterinaria guardada:', datos);

    this.mensajeExito = `¡La veterinaria "${this.nombre}" se ha registrado con éxito!`;
    this.mostrarModal = true;
  }

  cerrarModalYVolver(): void {
    this.mostrarModal = false;
    this.router.navigate(['/veterinarias']);
  }
}