import { Injectable, signal } from '@angular/core';

export interface ProductoVeterinaria {
  id: number;
  nombre: string;
  descripcion: string;
  estilo: string;
}

export interface Veterinaria {
  id: string;
  nombre: string;
  ciudad: string;
  distancia: string;
  servicios: string[];
  telefono: string;
  direccion: string;
  descripcion: string;
  horarios: string;
  color: string;
  productos: ProductoVeterinaria[];
}

const productosIniciales: ProductoVeterinaria[] = [
  { id: 1, nombre: 'Oxitetraciclina', descripcion: 'Antibiótico inyectable', estilo: 'oxitetraciclina' },
  { id: 2, nombre: 'Pomada alfa', descripcion: 'Antiflogística', estilo: 'pomada' },
  { id: 3, nombre: 'Dipirona', descripcion: 'Analgésico, antipirético y antiespasmódico.', estilo: 'dipirona' },
  { id: 4, nombre: 'Enervit Sachet 30 ml', descripcion: 'Suplemento', estilo: 'enervit' },
];

@Injectable({ providedIn: 'root' })
export class VeterinariasService {
  private readonly datos = signal<Veterinaria[]>([
    { id: 'los-mejores-amigos', nombre: 'Veterinaria los mejores amigos', ciudad: 'Yopal, Casanare', distancia: '1,2 km', servicios: ['Consulta general', 'Vacunación'], telefono: '+57 320 442 0110', direccion: 'Cra. 27 #11-40, Yopal, Casanare', descripcion: 'Productos y servicios veterinarios de calidad para el ganado bovino en Yopal.', horarios: 'Lunes a Sábado: 7am – 7pm · Emergencias: 24/7', color: '#2a8b5a', productos: productosIniciales.map((producto) => ({ ...producto })) },
    { id: 'los-llanos', nombre: 'Clínica Animal Los Llanos', ciudad: 'Yopal, Casanare', distancia: '3,8 km', servicios: ['Urgencias', 'Laboratorio'], telefono: '+57 310 212 4598', direccion: 'Yopal, Casanare', descripcion: 'Atención veterinaria integral y productos especializados para animales de la región.', horarios: 'Lunes a Sábado: 8am – 6pm', color: '#2672ad', productos: productosIniciales.map((producto) => ({ ...producto })) },
    { id: 'el-corral', nombre: 'Veterinaria El Corral', ciudad: 'Aguazul, Casanare', distancia: '18,4 km', servicios: ['Consulta general', 'Vacunación'], telefono: '+57 311 835 8701', direccion: 'Aguazul, Casanare', descripcion: 'Servicios y productos veterinarios para el cuidado de tus animales.', horarios: 'Lunes a Viernes: 8am – 6pm', color: '#a66d38', productos: productosIniciales.map((producto) => ({ ...producto })) },
    { id: 'oriente', nombre: 'AgroVet Oriente', ciudad: 'Tauramena, Casanare', distancia: '33,7 km', servicios: ['Laboratorio', 'Consulta general'], telefono: '+57 316 778 5112', direccion: 'Tauramena, Casanare', descripcion: 'Soluciones veterinarias profesionales para productores del oriente colombiano.', horarios: 'Lunes a Sábado: 7am – 5pm', color: '#7b5aa7', productos: productosIniciales.map((producto) => ({ ...producto })) },
  ]);

  readonly veterinarias = this.datos.asReadonly();

  obtener(id: string): Veterinaria {
    return this.datos().find((veterinaria) => veterinaria.id === id) ?? this.datos()[0];
  }

  actualizar(id: string, cambios: Partial<Veterinaria>): void {
    this.datos.update((veterinarias) => veterinarias.map((veterinaria) => veterinaria.id === id ? { ...veterinaria, ...cambios } : veterinaria));
  }

  guardarProducto(idVeterinaria: string, producto: ProductoVeterinaria): void {
    const veterinaria = this.obtener(idVeterinaria);
    const existe = veterinaria.productos.some((item) => item.id === producto.id);
    const productos = existe
      ? veterinaria.productos.map((item) => item.id === producto.id ? producto : item)
      : [...veterinaria.productos, { ...producto, id: Date.now() }];
    this.actualizar(idVeterinaria, { productos });
  }

  eliminarProducto(idVeterinaria: string, idProducto: number): void {
    const veterinaria = this.obtener(idVeterinaria);
    this.actualizar(idVeterinaria, { productos: veterinaria.productos.filter((producto) => producto.id !== idProducto) });
  }
}
