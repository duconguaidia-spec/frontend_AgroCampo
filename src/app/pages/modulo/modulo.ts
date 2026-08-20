import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-modulo',
  imports: [RouterLink],
  templateUrl: './modulo.html',
  styleUrl: './modulo.css',
})
export class ModuloComponent {
  readonly titulo: string;
  readonly descripcion: string;

  constructor(route: ActivatedRoute) {
    this.titulo = route.snapshot.data['titulo'];
    this.descripcion = route.snapshot.data['descripcion'];
  }
}
