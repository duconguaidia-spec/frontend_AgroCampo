import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { RecuperacionContrasenaService } from '../../services/recuperacion-contrasena';

@Component({
  selector: 'app-recuperacion-contrasena',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './recuperacion-contrasena.html',
  styleUrl: './recuperacion-contrasena.css'
})
export class RecuperacionContrasenaComponent {
  formularioRecuperacion: FormGroup;
  cargando = false;
  mensajeExito = '';
  mensajeError = '';

  constructor(
    private fb: FormBuilder,
    private recuperacionService: RecuperacionContrasenaService,
    private router: Router
  ) {
    this.formularioRecuperacion = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get email() {
    return this.formularioRecuperacion.get('email');
  }

  onSubmit(): void {
    if (this.formularioRecuperacion.invalid) {
      this.formularioRecuperacion.markAllAsTouched();
      return;
    }

    this.cargando = true;
    this.mensajeExito = '';
    this.mensajeError = '';

    const email = this.formularioRecuperacion.value.email;

    this.recuperacionService.solicitarRecuperacion(email).subscribe({
      next: (res) => {
        this.cargando = false;
        this.mensajeExito = res.message;
        this.formularioRecuperacion.reset();

        setTimeout(() => {
          this.router.navigate(['/restablecer-contrasena', res.token]);
        }, 2000);
      },
      error: () => {
        this.cargando = false;
        this.mensajeError = 'Ocurrió un error. Intenta nuevamente.';
      }
    });
  }
}