import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteFooterComponent } from '../../shared/site-footer/site-footer';
import { SiteHeaderComponent } from '../../shared/site-header/site-header';
import { RouterLink } from '@angular/router';

interface Veterinaria {
  id: string;
  nombre: string;
  ciudad: string;
  distancia: string;
  servicios: string[];
  telefono: string;
  color: string;
}

@Component({
  selector: 'app-veterinarias',
  standalone: true,
  imports: [CommonModule, RouterLink, SiteHeaderComponent, SiteFooterComponent],
  templateUrl: './veterinarias.html',
  styleUrl: './veterinarias.css',
})
export class VeterinariasComponent {
  protected busqueda = '';
  protected servicio = 'Todos los servicios';
  protected mensajeContacto = '';
  protected readonly servicios = ['Todos los servicios', 'Consulta general', 'Vacunación', 'Laboratorio', 'Urgencias'];
  protected readonly veterinarias: Veterinaria[] = [
    { id: 'los-mejores-amigos', nombre: 'Veterinaria los mejores amigos', ciudad: 'Yopal, Casanare', distancia: '1,2 km', servicios: ['Consulta general', 'Vacunación'], telefono: '+57 320 442 0110', color: '#2a8b5a' },
    { id: 'los-llanos', nombre: 'Clínica Animal Los Llanos', ciudad: 'Yopal, Casanare', distancia: '3,8 km', servicios: ['Urgencias', 'Laboratorio'], telefono: '+57 310 212 4598', color: '#2672ad' },
    { id: 'el-corral', nombre: 'Veterinaria El Corral', ciudad: 'Aguazul, Casanare', distancia: '18,4 km', servicios: ['Consulta general', 'Vacunación'], telefono: '+57 311 835 8701', color: '#a66d38' },
    { id: 'oriente', nombre: 'AgroVet Oriente', ciudad: 'Tauramena, Casanare', distancia: '33,7 km', servicios: ['Laboratorio', 'Consulta general'], telefono: '+57 316 778 5112', color: '#7b5aa7' },
  ];

  protected get resultados(): Veterinaria[] {
    const termino = this.busqueda.trim().toLowerCase();
    return this.veterinarias.filter((veterinaria) => (this.servicio === 'Todos los servicios' || veterinaria.servicios.includes(this.servicio)) && (!termino || `${veterinaria.nombre} ${veterinaria.ciudad} ${veterinaria.servicios.join(' ')}`.toLowerCase().includes(termino)));
  }

  protected buscar(event: Event): void { this.busqueda = (event.target as HTMLInputElement).value; }
  protected filtrar(event: Event): void { this.servicio = (event.target as HTMLSelectElement).value; }
  protected contactar(veterinaria: Veterinaria): void { this.mensajeContacto = `Consulta enviada a ${veterinaria.nombre}. Te responderán al número de contacto registrado.`; }
}
