import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class FooterComponent {
  readonly anio = new Date().getFullYear();
  readonly institucion = 'Sistema de gestión de información agropecuaria y veterinaria';
}
