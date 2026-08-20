import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteFooterComponent } from '../../shared/site-footer/site-footer';
import { SiteHeaderComponent } from '../../shared/site-header/site-header';

interface PreguntaFrecuente { titulo: string; respuesta: string; }

@Component({
  selector: 'app-ayuda-soporte',
  standalone: true,
  imports: [CommonModule, SiteHeaderComponent, SiteFooterComponent],
  templateUrl: './ayuda-soporte.html',
  styleUrl: './ayuda-soporte.css',
})
export class AyudaSoporteComponent {
  protected busqueda = '';
  protected reporteAbierto = false;
  protected reporteEnviado = false;
  protected preguntaActiva?: PreguntaFrecuente;
  protected readonly preguntas: PreguntaFrecuente[] = [
    { titulo: 'Verificación en dos pasos', respuesta: 'Al iniciar sesión recibirás un código temporal en tu correo. Ingresa el código antes de que expire para confirmar el acceso.' },
    { titulo: 'Error al registrarse', respuesta: 'Verifica que el correo no exista y que la contraseña incluya mayúscula, minúscula, número y carácter especial.' },
    { titulo: 'Cómo actualizar mis datos', respuesta: 'Abre el menú de usuario, selecciona Perfil de usuario, actualiza los campos necesarios y guarda los cambios.' },
    { titulo: 'Cómo registrar una veterinaria', respuesta: 'El registro debe realizarlo un veterinario o administrador. Incluye los datos de contacto, ubicación y servicios.' },
    { titulo: 'Cómo actualizar productos', respuesta: 'Desde el panel de la veterinaria podrás crear, editar y consultar el inventario de productos e insumos.' },
    { titulo: 'Error al iniciar sesión', respuesta: 'Comprueba correo y contraseña. Si olvidaste la clave usa la recuperación de contraseña o reporta la incidencia.' },
  ];

  protected get preguntasFiltradas(): PreguntaFrecuente[] {
    const termino = this.busqueda.trim().toLowerCase();
    return this.preguntas.filter((pregunta) => !termino || `${pregunta.titulo} ${pregunta.respuesta}`.toLowerCase().includes(termino));
  }

  protected buscar(event: Event): void { this.busqueda = (event.target as HTMLInputElement).value; }
  protected seleccionar(pregunta: PreguntaFrecuente): void { this.preguntaActiva = pregunta; this.reporteEnviado = false; }
  protected enviarReporte(): void { this.reporteEnviado = true; this.reporteAbierto = false; }
}
