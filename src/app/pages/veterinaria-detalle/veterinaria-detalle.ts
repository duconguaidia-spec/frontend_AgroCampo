import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SiteFooterComponent } from '../../shared/site-footer/site-footer';
import { SiteHeaderComponent } from '../../shared/site-header/site-header';

interface Producto { nombre: string; descripcion: string; estilo: string; }
interface VeterinariaDetalle { nombre: string; descripcion: string; direccion: string; telefono: string; productos: Producto[]; }

const PRODUCTOS: Producto[] = [
  { nombre: 'Oxitetraciclina', descripcion: 'Antibiótico inyectable', estilo: 'oxitetraciclina' },
  { nombre: 'Pomada alfa', descripcion: 'Antiflogística', estilo: 'pomada' },
  { nombre: 'Dipirona', descripcion: 'Analgésico, antipirético y antiespasmódico.', estilo: 'dipirona' },
  { nombre: 'Enervit Sachet 30 ml', descripcion: 'Suplemento', estilo: 'enervit' },
];

const VETERINARIAS: Record<string, VeterinariaDetalle> = {
  'los-mejores-amigos': { nombre: 'Veterinaria los mejores amigos', descripcion: 'Productos y servicios veterinarios de calidad para el ganado bovino en Yopal.', direccion: 'Cra. 27 #11-40, Yopal, Casanare', telefono: 'Tel: 310 256 7890 / 310 254 1234', productos: PRODUCTOS },
  'los-llanos': { nombre: 'Clínica Animal Los Llanos', descripcion: 'Atención veterinaria integral y productos especializados para animales de la región.', direccion: 'Yopal, Casanare', telefono: 'Tel: 310 212 4598', productos: PRODUCTOS },
  'el-corral': { nombre: 'Veterinaria El Corral', descripcion: 'Servicios y productos veterinarios para el cuidado de tus animales.', direccion: 'Aguazul, Casanare', telefono: 'Tel: 311 835 8701', productos: PRODUCTOS },
  oriente: { nombre: 'AgroVet Oriente', descripcion: 'Soluciones veterinarias profesionales para productores del oriente colombiano.', direccion: 'Tauramena, Casanare', telefono: 'Tel: 316 778 5112', productos: PRODUCTOS },
};

@Component({ selector: 'app-veterinaria-detalle', standalone: true, imports: [RouterLink, SiteHeaderComponent, SiteFooterComponent], templateUrl: './veterinaria-detalle.html', styleUrl: './veterinaria-detalle.css' })
export class VeterinariaDetalleComponent {
  private readonly route = inject(ActivatedRoute);
  protected termino = '';
  protected readonly veterinaria = computed(() => VETERINARIAS[this.route.snapshot.paramMap.get('id') ?? 'los-mejores-amigos'] ?? VETERINARIAS['los-mejores-amigos']);
  protected get productosFiltrados(): Producto[] { const termino = this.termino.trim().toLocaleLowerCase(); return this.veterinaria().productos.filter((producto) => !termino || `${producto.nombre} ${producto.descripcion}`.toLocaleLowerCase().includes(termino)); }
  protected buscar(event: Event): void { this.termino = (event.target as HTMLInputElement).value; }
}
