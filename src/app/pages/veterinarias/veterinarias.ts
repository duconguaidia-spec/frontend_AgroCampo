import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteFooterComponent } from '../../shared/site-footer/site-footer';
import { SiteHeaderComponent } from '../../shared/site-header/site-header';
import { RouterLink } from '@angular/router';
import { AutenticacionService } from '../../services/autenticacion';
import { Veterinaria, VeterinariasService } from '../../services/veterinarias';

declare global {
  interface Window {
    AGROCAMPO_GOOGLE_MAPS_API_KEY?: string;
    google?: any;
  }
}

@Component({
  selector: 'app-veterinarias',
  standalone: true,
  imports: [CommonModule, RouterLink, SiteHeaderComponent, SiteFooterComponent],
  templateUrl: './veterinarias.html',
  styleUrl: './veterinarias.css',
})
export class VeterinariasComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('mapaGoogle') private mapaGoogle?: ElementRef<HTMLDivElement>;
  protected busqueda = '';
  protected servicio = 'Todos los servicios';
  protected mensajeContacto = '';
  protected mapaActivo = false;
  protected mapaSinClave = false;
  protected cargando = true;
  protected errorCarga = '';
  private mapa?: any;
  private marcadores: any[] = [];
  protected readonly servicios = ['Todos los servicios', 'Consulta general', 'Vacunación', 'Laboratorio', 'Urgencias'];
  protected get veterinarias(): Veterinaria[] { return this.veterinariasService.veterinarias(); }

  constructor(protected readonly autenticacion: AutenticacionService, private readonly veterinariasService: VeterinariasService) {}

  ngOnInit(): void {
    this.veterinariasService.listar().subscribe({
      next: () => { this.cargando = false; this.actualizarMarcadores(); },
      error: (error: { error?: { message?: string }; message?: string }) => {
        this.cargando = false;
        this.errorCarga = error.error?.message || error.message || 'No fue posible cargar las veterinarias desde el MID.';
      },
    });
  }

  ngAfterViewInit(): void {
    void this.inicializarMapa();
  }

  ngOnDestroy(): void {
    this.marcadores.forEach((marcador) => marcador.setMap(null));
  }

  protected get resultados(): Veterinaria[] {
    const termino = this.busqueda.trim().toLowerCase();
    return this.veterinarias.filter((veterinaria) => (this.servicio === 'Todos los servicios' || veterinaria.servicios.includes(this.servicio)) && (!termino || `${veterinaria.nombre} ${veterinaria.ciudad} ${veterinaria.servicios.join(' ')}`.toLowerCase().includes(termino)));
  }

  protected buscar(event: Event): void { this.busqueda = (event.target as HTMLInputElement).value; this.actualizarMarcadores(); }
  protected filtrar(event: Event): void { this.servicio = (event.target as HTMLSelectElement).value; this.actualizarMarcadores(); }
  protected contactar(veterinaria: Veterinaria): void { this.mensajeContacto = `Consulta enviada a ${veterinaria.nombre}. Te responderán al número de contacto registrado.`; }

  protected abrirEnGoogleMaps(): void {
    window.open('https://www.google.com/maps/search/?api=1&query=Veterinarias+Yopal+Casanare', '_blank', 'noopener,noreferrer');
  }

  private async inicializarMapa(): Promise<void> {
    try {
      const google = await this.cargarGoogleMaps();
      if (!google || !this.mapaGoogle) return;

      this.mapa = new google.maps.Map(this.mapaGoogle.nativeElement, {
        center: { lat: 5.3378, lng: -72.3959 },
        zoom: 11,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
      });
      this.mapaActivo = true;
      this.actualizarMarcadores();
    } catch {
      this.mapaSinClave = true;
    }
  }

  private actualizarMarcadores(): void {
    if (!this.mapa || !window.google) return;
    this.marcadores.forEach((marcador) => marcador.setMap(null));
    this.marcadores = this.resultados.map((veterinaria) => {
      if (veterinaria.latitud == null || veterinaria.longitud == null) return null;
      const marcador = new window.google.maps.Marker({
        map: this.mapa,
        position: { lat: veterinaria.latitud, lng: veterinaria.longitud },
        title: veterinaria.nombre,
      });
      marcador.addListener('click', () => this.contactar(veterinaria));
      return marcador;
    }).filter(Boolean);
  }

  private cargarGoogleMaps(): Promise<any | null> {
    if (window.google?.maps) return Promise.resolve(window.google);
    const clave = window.AGROCAMPO_GOOGLE_MAPS_API_KEY || document.querySelector('meta[name="google-maps-api-key"]')?.getAttribute('content');
    if (!clave) {
      this.mapaSinClave = true;
      return Promise.resolve(null);
    }
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(clave)}`;
      script.async = true;
      script.onload = () => resolve(window.google);
      script.onerror = () => reject(new Error('No fue posible cargar Google Maps.'));
      document.head.appendChild(script);
    });
  }
}
