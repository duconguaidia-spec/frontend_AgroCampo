import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class FooterComponent {
  readonly version = '1.0.0';
  readonly anio = new Date().getFullYear();
  readonly institucion = 'Servicio Nacional de Aprendizaje · SENA';
  readonly desarrollador = 'Equipo AgroCampo';
}
