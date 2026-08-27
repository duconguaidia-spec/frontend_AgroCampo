import { Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
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
export class VeterinariaDetalleComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly veterinariasService = inject(VeterinariasService);
  protected readonly autenticacion = inject(AutenticacionService);
  protected termino = '';
  protected editando = false;
  protected mensaje = '';
  protected productoEnEdicion: number | null = null;
  protected formularioProducto = this.productoVacio();
  private readonly id = this.route.snapshot.paramMap.get('id') ?? 'los-mejores-amigos';
  protected readonly veterinaria = computed(() => this.veterinariasService.obtener(this.id));
  protected borrador = this.datosBorrador();

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
    this.veterinariasService.actualizar(this.id, { ...this.borrador });
    this.mensaje = 'La información de la veterinaria se actualizó correctamente.';
    this.editando = false;
  }

  protected cancelarEdicion(): void {
    this.editando = false;
    this.borrador = this.datosBorrador();
  }

  protected editarProducto(producto: ProductoVeterinaria): void {
    this.productoEnEdicion = producto.id;
    this.formularioProducto = { ...producto };
  }

  protected guardarProducto(): void {
    if (!this.formularioProducto.nombre.trim() || !this.formularioProducto.descripcion.trim()) return;
    this.veterinariasService.guardarProducto(this.id, this.formularioProducto);
    this.formularioProducto = this.productoVacio();
    this.productoEnEdicion = null;
    this.mensaje = 'El producto se guardó correctamente.';
  }

  protected eliminarProducto(idProducto: number): void {
    this.veterinariasService.eliminarProducto(this.id, idProducto);
    this.mensaje = 'El producto se eliminó correctamente.';
  }

  protected cancelarProducto(): void {
    this.productoEnEdicion = null;
    this.formularioProducto = this.productoVacio();
  }

  private datosBorrador() {
    const veterinaria = this.veterinaria();
    return { nombre: veterinaria.nombre, descripcion: veterinaria.descripcion, direccion: veterinaria.direccion, telefono: veterinaria.telefono, horarios: veterinaria.horarios };
  }

  private productoVacio(): ProductoVeterinaria {
    return { id: 0, nombre: '', descripcion: '', estilo: 'custom' };
  }
}
