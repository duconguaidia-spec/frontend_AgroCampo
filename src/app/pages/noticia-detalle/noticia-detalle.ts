import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SiteFooterComponent } from '../../shared/site-footer/site-footer';
import { SiteHeaderComponent } from '../../shared/site-header/site-header';

interface NoticiaDetalle {
  titulo: string;
  resumen: string;
  fecha: string;
  imagen: 'agroindustria' | 'sostenible' | 'ganaderia' | 'tecnologia' | 'economia';
}

const NOTICIAS: Record<string, NoticiaDetalle> = {
  '1': { titulo: 'Nuevas tendencias en la agroindustria para el 2026', resumen: 'Descubre las últimas tendencias y tecnologías que impulsan la agroindustria este año.', fecha: '24 de febrero de 2026, 12:30 p. m.', imagen: 'agroindustria' },
  '2': { titulo: 'La importancia de la agricultura sostenible en tiempos de cambio climático', resumen: 'Estrategias para producir más, conservar el suelo y aprovechar mejor los recursos disponibles.', fecha: '24 de febrero de 2026, 10:15 a. m.', imagen: 'sostenible' },
  '3': { titulo: 'Estrategias para mejorar la salud del ganado', resumen: 'Buenas prácticas y controles preventivos para el bienestar de los animales.', fecha: '24 de enero de 2026, 9:00 a. m.', imagen: 'ganaderia' },
  '4': { titulo: 'Nuevas aplicaciones para el control y monitoreo de cultivos', resumen: 'Herramientas digitales para tomar decisiones en tiempo real desde la finca.', fecha: '20 de enero de 2026, 3:20 p. m.', imagen: 'tecnologia' },
  '5': { titulo: 'Perspectivas económicas para el sector agrícola en 2026', resumen: 'Análisis de oportunidades, costos y tendencias para productores rurales.', fecha: '18 de enero de 2026, 11:40 a. m.', imagen: 'economia' },
};

@Component({
  selector: 'app-noticia-detalle',
  standalone: true,
  imports: [RouterLink, SiteHeaderComponent, SiteFooterComponent],
  templateUrl: './noticia-detalle.html',
  styleUrl: './noticia-detalle.css',
})
export class NoticiaDetalleComponent {
  private readonly route = inject(ActivatedRoute);
  protected readonly noticia = computed(() => NOTICIAS[this.route.snapshot.paramMap.get('id') ?? '1'] ?? NOTICIAS['1']);
}
