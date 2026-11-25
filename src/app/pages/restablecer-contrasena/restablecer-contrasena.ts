import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { RecuperacionContrasenaService } from '../../services/recuperacion-contrasena';
import { mensajeApi } from '../../services/modulos';

@Component({
  selector: 'app-restablecer-contrasena',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './restablecer-contrasena.html',
  styleUrl: './restablecer-contrasena.css',
})
export class RestablecerContrasenaComponent {
  private readonly recuperacion = inject(RecuperacionContrasenaService);
  readonly token = inject(ActivatedRoute).snapshot.paramMap.get('token') ?? '';
  readonly formularioReset = inject(FormBuilder).nonNullable.group({
    nuevaContrasena: ['', [Validators.required, Validators.minLength(8)]],
    confirmarContrasena: ['', Validators.required],
  });
  readonly cargando = signal(false);
  readonly mensajeExito = signal('');
  readonly mensajeError = signal('');

  onSubmitPassword(): void {
    if (this.cargando() || !this.token) return;
    const { nuevaContrasena, confirmarContrasena } = this.formularioReset.getRawValue();
    if (this.formularioReset.invalid || nuevaContrasena !== confirmarContrasena) {
      this.mensajeError.set('Ingresa y confirma la misma contraseña de al menos 8 caracteres.');
      return;
    }
    this.cargando.set(true);
    this.mensajeError.set('');
    this.recuperacion.restablecerContrasena(this.token, nuevaContrasena).pipe(
      finalize(() => this.cargando.set(false)),
    ).subscribe({
      next: (res) => { this.mensajeExito.set(res.message); this.formularioReset.reset(); },
      error: (error) => this.mensajeError.set(mensajeApi(error, 'No fue posible restablecer la contraseña.')),
    });
  }
}
