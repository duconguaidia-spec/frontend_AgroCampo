import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { RecuperacionContrasenaService } from '../../services/recuperacion-contrasena';

const CODIGO_VALIDO = '123456';

@Component({
  selector: 'app-recuperacion-contrasena',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './recuperacion-contrasena.html',
  styleUrl: './recuperacion-contrasena.css'
})
export class RecuperacionContrasenaComponent {
  paso: 'email' | 'codigo' = 'email';

  formularioRecuperacion: FormGroup;
  formularioCodigo: FormGroup;

  cargando = false;
  mensajeExito = '';
  mensajeError = '';
  errorCodigo = '';

  private tokenGenerado = '';

  constructor(
    private fb: FormBuilder,
    private recuperacionService: RecuperacionContrasenaService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.formularioRecuperacion = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.formularioCodigo = this.fb.group({
      codigo: ['', [Validators.required]]
    });
  }

  get email() {
    return this.formularioRecuperacion.get('email');
  }

  get codigo() {
    return this.formularioCodigo.get('codigo');
  }

  onSubmitEmail(): void {
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
        this.tokenGenerado = res.token ?? '';
        this.paso = 'codigo';
        this.cdr.detectChanges();
      },
      error: () => {
        this.cargando = false;
        this.mensajeError = 'Ocurrió un error. Intenta nuevamente.';
        this.cdr.detectChanges();
      }
    });
  }

  onSubmitCodigo(): void {
    if (this.formularioCodigo.invalid) {
      this.formularioCodigo.markAllAsTouched();
      return;
    }

    this.errorCodigo = '';
    const codigoIngresado = this.formularioCodigo.value.codigo;

    if (codigoIngresado === CODIGO_VALIDO) {
      this.router.navigate(['/restablecer-contrasena', this.tokenGenerado]);
    } else {
      this.errorCodigo = 'Código incorrecto. Intenta nuevamente.';
      this.cdr.detectChanges();
    }
  }

  volverAEmail(): void {
    this.paso = 'email';
    this.formularioCodigo.reset();
    this.errorCodigo = '';
    this.cdr.detectChanges();
  }

  volverALogin(): void {
    this.router.navigate(['/login']);
  }
}