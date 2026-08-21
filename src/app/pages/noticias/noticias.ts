import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteFooterComponent } from '../../shared/site-footer/site-footer';
import { SiteHeaderComponent } from '../../shared/site-header/site-header';
import { RouterLink } from '@angular/router';

interface Noticia {
  id: number;
  categoria: string;
  fecha: string;
  titulo: string;
  resumen: string;
  tono: 'field' | 'seedling' | 'cattle' | 'drone' | 'market';
}

@Component({
  selector: 'app-noticias',
  standalone: true,
  imports: [CommonModule, RouterLink, SiteHeaderComponent, SiteFooterComponent],
  templateUrl: './noticias.html',
  styleUrl: './noticias.css',
})
export class NoticiasComponent {
  protected readonly categorias = ['Agroindustria', 'Agricultura sostenible', 'Tecnología Agrícola', 'Ganadería', 'Economía Rural'];
  protected readonly seleccionadas = new Set(this.categorias);
  protected termino = '';

  protected readonly noticias: Noticia[] = [
    { id: 1, categoria: 'Agroindustria', fecha: '24 feb 2026', titulo: 'Nuevas tendencias en la agroindustria para el 2026', resumen: 'Conoce tecnologías y prácticas que impulsan la productividad y la trazabilidad de los alimentos.', tono: 'field' },
    { id: 2, categoria: 'Agricultura sostenible', fecha: '24 feb 2026', titulo: 'La importancia de la agricultura sostenible en tiempos de cambio climático', resumen: 'Estrategias para producir más, conservar el suelo y usar mejor los recursos disponibles.', tono: 'seedling' },
    { id: 3, categoria: 'Ganadería', fecha: '24 ene 2026', titulo: 'Estrategias para mejorar la salud del ganado', resumen: 'Buenas prácticas y controles preventivos para el bienestar de los animales.', tono: 'cattle' },
    { id: 4, categoria: 'Tecnología Agrícola', fecha: '20 ene 2026', titulo: 'Nuevas aplicaciones para el control y monitoreo de cultivos', resumen: 'Herramientas digitales para tomar decisiones en tiempo real desde la finca.', tono: 'drone' },
    { id: 5, categoria: 'Economía Rural', fecha: '18 ene 2026', titulo: 'Perspectivas económicas para el sector agrícola en 2026', resumen: 'Análisis de oportunidades, costos y tendencias para productores rurales.', tono: 'market' },
  ];

  protected get noticiasFiltradas(): Noticia[] {
    const termino = this.termino.trim().toLocaleLowerCase();
    return this.noticias.filter((noticia) => this.seleccionadas.has(noticia.categoria) && (!termino || `${noticia.titulo} ${noticia.resumen} ${noticia.categoria}`.toLocaleLowerCase().includes(termino)));
  }

  protected toggleCategoria(categoria: string): void {
    this.seleccionadas.has(categoria) ? this.seleccionadas.delete(categoria) : this.seleccionadas.add(categoria);
  }

  protected actualizarBusqueda(event: Event): void {
    this.termino = (event.target as HTMLInputElement).value;
  }
}
