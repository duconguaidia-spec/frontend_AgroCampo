import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteFooterComponent } from '../../shared/site-footer/site-footer';
import { SiteHeaderComponent } from '../../shared/site-header/site-header';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-agregar-veterinaria',
  standalone: true,
  imports: [CommonModule, RouterLink, SiteHeaderComponent, SiteFooterComponent],
  templateUrl: './agregar-veterinaria.html',
  styleUrl: './agregar-veterinaria.css',
})
export class AgregarVeterinariaComponent {
  
}
