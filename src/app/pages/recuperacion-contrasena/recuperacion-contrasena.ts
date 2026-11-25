import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { RecuperacionContrasenaService } from '../../services/recuperacion-contrasena';
import { mensajeApi } from '../../services/modulos';

@Component({
  selector: 'app-recuperacion-contrasena',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './recuperacion-contrasena.html',
  styleUrl: './recuperacion-contrasena.css',
})
export class RecuperacionContrasenaComponent {
  private readonly recuperacion = inject(RecuperacionContrasenaService);
  readonly formularioRecuperacion = inject(FormBuilder).nonNullable.group({ email: ['', [Validators.required, Validators.email]] });
  readonly cargando = signal(false);
  readonly mensajeExito = signal('');
  readonly mensajeError = signal('');

  onSubmitEmail(): void {
    if (this.cargando()) return;
    if (this.formularioRecuperacion.invalid) { this.formularioRecuperacion.markAllAsTouched(); return; }
    this.cargando.set(true);
    this.mensajeExito.set('');
    this.mensajeError.set('');
    this.recuperacion.solicitarRecuperacion(this.formularioRecuperacion.controls.email.value.trim())
      .pipe(finalize(() => this.cargando.set(false))).subscribe({
        next: (res) => this.mensajeExito.set(res.message),
        error: (error) => this.mensajeError.set(mensajeApi(error, 'No fue posible solicitar la recuperación.')),
      });
  }
}
