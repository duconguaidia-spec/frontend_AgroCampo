import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-pagina-de-inicio',
  standalone:true,
  imports: [CommonModule],
  templateUrl: './pagina-de-inicio.html',
  styleUrl: './pagina-de-inicio.css',
})
export class PaginaDeInicioComponent {

  anioActual: number = new Date().getFullYear();

  constructor(private router: Router){}

  inicioSesion(): void{
    this.router.navigate(['/login']);
  }

  crearCuenta(): void{
    this.router.navigate(['/register']);
  }

  irMasInformacion():void{
    this.router.navigate(['/mas-informacion']);
  }

}
