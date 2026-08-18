import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class FooterComponent {
  readonly anio = new Date().getFullYear();
  readonly institucion = 'Sistema de gestión de información agropecuaria y veterinaria';
}
