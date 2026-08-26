import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { SiteFooterComponent } from '../../shared/site-footer/site-footer';
import { SiteHeaderComponent } from '../../shared/site-header/site-header';

Chart.register(...registerables);

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [CommonModule, SiteHeaderComponent, SiteFooterComponent],
  templateUrl: './estadisticas-sector.html',
  styleUrl: './estadisticas-sector.css',
})
export class EstadisticasSectorComponent implements AfterViewInit {
  @ViewChild('cultivosCanvas') cultivosCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('ganadoCanvas') ganadoCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('aguaCanvas') aguaCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('exportacionesCanvas') exportacionesCanvas!: ElementRef<HTMLCanvasElement>;

  ngAfterViewInit(): void {
    this.crearGraficoCultivos();
    this.crearGraficoGanado();
    this.crearGraficoAgua();
    this.crearGraficoExportaciones();
  }

  private crearGraficoCultivos(): void {
    new Chart(this.cultivosCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Café', 'Arroz', 'Maíz', 'Papa', 'Caña de azúcar', 'Palma de aceite'],
        datasets: [{
          label: 'Área sembrada (miles de hectáreas)',
          data: [845, 620, 580, 130, 245, 590],
          backgroundColor: '#2f7d4f',
          borderRadius: 6,
        }],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } },
      },
    });
  }

  private crearGraficoGanado(): void {
    new Chart(this.ganadoCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: ['2015', '2017', '2019', '2021', '2023', '2025'],
        datasets: [{
          label: 'Cabezas de ganado (millones)',
          data: [22.6, 23.4, 24.1, 22.8, 28.2, 29.1],
          borderColor: '#2f7d4f',
          backgroundColor: 'rgba(47, 125, 79, 0.15)',
          fill: true,
          tension: 0.35,
        }],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
      },
    });
  }

  private crearGraficoAgua(): void {
    new Chart(this.aguaCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Frijol', 'Algodón', 'Arroz', 'Café', 'Caña de azúcar', 'Papa'],
        datasets: [{
          label: 'Litros de agua por kg producido',
          data: [5000, 2700, 2500, 1900, 1500, 250],
          backgroundColor: '#4a90d9',
          borderRadius: 6,
        }],
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        plugins: { legend: { display: false } },
      },
    });
  }

  private crearGraficoExportaciones(): void {
    new Chart(this.exportacionesCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Café', 'Flores', 'Banano', 'Aguacate Hass', 'Azúcar', 'Otros'],
        datasets: [{
          data: [38, 22, 14, 10, 8, 8],
          backgroundColor: ['#2f7d4f', '#4a90d9', '#e0a83c', '#c0563e', '#8e6bb0', '#9aa5ab'],
        }],
      },
      options: { responsive: true },
    });
  }
}