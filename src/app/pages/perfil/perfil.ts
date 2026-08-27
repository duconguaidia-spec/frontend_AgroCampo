import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SiteFooterComponent } from '../../shared/site-footer/site-footer';
import { SiteHeaderComponent } from '../../shared/site-header/site-header';

interface Perfil {
  nombre: string;
  apellido: string;
  telefono: string;
  ubicacion: string;
  rol: string;
  foto: string | null;
}

const CLAVE_STORAGE = 'agrocampo_perfil';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [FormsModule, SiteHeaderComponent, SiteFooterComponent],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})
export class PerfilComponent implements OnInit {
  protected perfil: Perfil = {
    nombre: 'Rafael Camilo',
    apellido: 'Torongo Martínez',
    telefono: '312 555 0184',
    ubicacion: 'Yopal, Casanare',
    rol: 'Usuario General',
    foto: null,
  };

  protected readonly intereses = ['Maíz', 'Trigo', 'Ganado bovino', 'Irrigación', 'Agricultura sostenible', 'Plagas'];
  protected interesesActivos = new Set(['Maíz', 'Trigo', 'Ganado bovino', 'Irrigación']);
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
    if (!archivo) return;

    const lector = new FileReader();
    lector.onload = () => {
      this.perfil.foto = lector.result as string;
      this.guardado = false;
    };
    lector.readAsDataURL(archivo);
  }

  private cargarPerfil(): void {
    const datosGuardados = localStorage.getItem(CLAVE_STORAGE);
    if (!datosGuardados) return;

    const parseado = JSON.parse(datosGuardados);
    this.perfil = parseado.perfil;
    this.interesesActivos = new Set(parseado.intereses);
  }

  protected guardar(): void {
    const datosAGuardar = {
      perfil: this.perfil,
      intereses: Array.from(this.interesesActivos),
    };
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(datosAGuardar));
    this.guardado = true;
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