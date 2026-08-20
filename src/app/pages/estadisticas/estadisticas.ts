import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteFooterComponent } from '../../shared/site-footer/site-footer';
import { SiteHeaderComponent } from '../../shared/site-header/site-header';

interface CategoriaPrecio {
  sigla: string;
  color: string;
}

interface Subasta {
  fecha: string;
  valores: number[];
}

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [CommonModule, SiteHeaderComponent, SiteFooterComponent],
  templateUrl: './estadisticas.html',
  styleUrl: './estadisticas.css',
})
export class EstadisticasComponent {
  protected readonly categorias: CategoriaPrecio[] = [
    { sigla: 'HL', color: '#69707a' }, { sigla: 'MC', color: '#9b6b48' }, { sigla: 'MG', color: '#ef8a29' },
    { sigla: 'ML', color: '#898989' }, { sigla: 'NC', color: '#6372d8' }, { sigla: 'NG', color: '#df8d58' }, { sigla: 'VC', color: '#f2d360' },
  ];
  protected readonly subastas: Subasta[] = [
    { fecha: '26 feb 2026', valores: [8043, 9490, 8983, 10459, 7612, 7719, 6759] },
    { fecha: '24 feb 2026', valores: [7444, 8288, 9403, 10190, 7494, 8032, 6188] },
    { fecha: '19 feb 2026', valores: [8310, 9032, 9400, 11000, 7253, 7410, 6455] },
    { fecha: '17 feb 2026', valores: [8142, 8683, 9067, 10710, 7325, 8169, 5905] },
  ];
  protected readonly maximo = 12000;
  protected exportMessage = '';

  protected exportar(formato: 'PDF' | 'Excel'): void {
    this.exportMessage = `La exportación en ${formato} quedará disponible al conectar el módulo de reportes con la API.`;
  }
}
