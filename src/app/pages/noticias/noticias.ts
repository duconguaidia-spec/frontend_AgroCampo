import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SiteFooterComponent } from '../../shared/site-footer/site-footer';
import { SiteHeaderComponent } from '../../shared/site-header/site-header';
import { AutenticacionService } from '../../services/autenticacion';

interface Noticia {
  id: number;
  categoria: string;
  fecha: string;
  titulo: string;
  resumen: string;
  fuente: string;
  imagen: string;
}

@Component({
  selector: 'app-noticias',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, SiteHeaderComponent, SiteFooterComponent],
  templateUrl: './noticias.html',
  styleUrl: './noticias.css',
})
export class NoticiasComponent {
  protected readonly categorias = ['Agroindustria', 'Agricultura sostenible', 'Tecnología Agrícola', 'Ganadería', 'Economía Rural'];
  protected readonly seleccionadas = new Set(this.categorias);
  protected termino = '';
  protected formularioVisible = false;
  protected mensajeFormulario = '';
  protected nuevaNoticia = this.crearFormularioVacio();
  protected noticias: Noticia[] = [
    { id: 1, categoria: 'Agroindustria', fecha: '24 feb 2026', titulo: 'Nuevas tendencias en la agroindustria para el 2026', resumen: 'Conoce tecnologías y prácticas que impulsan la productividad y la trazabilidad de los alimentos.', fuente: 'AgroCampo', imagen: 'assets/images/campo_verde.jpg' },
    { id: 2, categoria: 'Agricultura sostenible', fecha: '24 feb 2026', titulo: 'La importancia de la agricultura sostenible en tiempos de cambio climático', resumen: 'Estrategias para producir más, conservar el suelo y usar mejor los recursos disponibles.', fuente: 'AgroCampo', imagen: 'assets/images/fondo_login.png' },
    { id: 3, categoria: 'Ganadería', fecha: '24 ene 2026', titulo: 'Estrategias para mejorar la salud del ganado', resumen: 'Buenas prácticas y controles preventivos para el bienestar de los animales.', fuente: 'Red veterinaria', imagen: 'assets/images/campo_atardecer.jpg' },
    { id: 4, categoria: 'Tecnología Agrícola', fecha: '20 ene 2026', titulo: 'Nuevas aplicaciones para el control y monitoreo de cultivos', resumen: 'Herramientas digitales para tomar decisiones en tiempo real desde la finca.', fuente: 'AgroCampo', imagen: 'assets/images/campo_amanecer.png' },
    { id: 5, categoria: 'Economía Rural', fecha: '18 ene 2026', titulo: 'Perspectivas económicas para el sector agrícola en 2026', resumen: 'Análisis de oportunidades, costos y tendencias para productores rurales.', fuente: 'AgroCampo', imagen: 'assets/images/campo_atardecer.jpg' },
  ];

  constructor(protected readonly autenticacion: AutenticacionService) {}

  protected get noticiasFiltradas(): Noticia[] {
    const termino = this.normalizar(this.termino);
    return this.noticias.filter((noticia) => this.seleccionadas.has(noticia.categoria) && (!termino || this.normalizar(`${noticia.titulo} ${noticia.resumen} ${noticia.categoria}`).includes(termino)));
  }

  protected toggleCategoria(categoria: string): void {
    this.seleccionadas.has(categoria) ? this.seleccionadas.delete(categoria) : this.seleccionadas.add(categoria);
  }

  protected actualizarBusqueda(event: Event): void {
    this.termino = (event.target as HTMLInputElement).value;
  }

  protected abrirFormulario(): void {
    this.formularioVisible = true;
    this.mensajeFormulario = '';
  }

  protected cancelarFormulario(): void {
    this.formularioVisible = false;
    this.nuevaNoticia = this.crearFormularioVacio();
  }

  protected cargarImagen(event: Event): void {
    const archivo = (event.target as HTMLInputElement).files?.[0];
    if (!archivo) return;
    const lector = new FileReader();
    lector.onload = () => this.nuevaNoticia.imagen = String(lector.result);
    lector.readAsDataURL(archivo);
  }

  protected agregarNoticia(): void {
    const noticia = this.nuevaNoticia;
    if (!noticia.titulo.trim() || !noticia.resumen.trim() || !noticia.fecha || !noticia.fuente.trim()) {
      this.mensajeFormulario = 'Completa el título, la descripción, la fecha y la fuente.';
      return;
    }

    this.noticias = [{ ...noticia, id: Date.now(), imagen: noticia.imagen || 'assets/images/campo_verde.jpg' }, ...this.noticias];
    this.cancelarFormulario();
  }

  private crearFormularioVacio(): Omit<Noticia, 'id'> {
    return { categoria: this.categorias[0], fecha: '', titulo: '', resumen: '', fuente: '', imagen: '' };
  }

  private normalizar(valor: string): string {
    return valor.trim().toLocaleLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }
}
