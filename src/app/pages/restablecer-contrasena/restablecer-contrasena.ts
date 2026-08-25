import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RecuperacionContrasenaService } from '../../services/recuperacion-contrasena';

const CODIGO_VALIDO = '123456';

function contrasenasCoincidenValidator(group: AbstractControl): ValidationErrors | null {
  const pass = group.get('nuevaContrasena')?.value;
  const confirm = group.get('confirmarContrasena')?.value;
  return pass === confirm ? null : { contrasenasNoCoinciden: true };
}

@Component({
  selector: 'app-restablecer-contrasena',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './restablecer-contrasena.html',
  styleUrl: './restablecer-contrasena.css'
})
export class RestablecerContrasenaComponent implements OnInit {
  paso: 'password' | 'codigo' = 'password';

  formularioReset: FormGroup;
  formularioCodigo: FormGroup;

  token: string = '';
  cargando = false;
  mensajeExito = '';
  mensajeError = '';
  errorCodigo = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private recuperacionService: RecuperacionContrasenaService,
    private cdr: ChangeDetectorRef
  ) {
    this.formularioReset = this.fb.group({
      nuevaContrasena: ['', [Validators.required, Validators.minLength(6)]],
      confirmarContrasena: ['', Validators.required]
    }, { validators: contrasenasCoincidenValidator });

    this.formularioCodigo = this.fb.group({
      codigo: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token') || '';

    if (!this.token) {
      this.mensajeError = 'Enlace inválido o expirado.';
    }
  }

  get nuevaContrasena() {
    return this.formularioReset.get('nuevaContrasena');
  }

  get confirmarContrasena() {
    return this.formularioReset.get('confirmarContrasena');
  }

  get codigo() {
    return this.formularioCodigo.get('codigo');
  }

  onSubmitPassword(): void {
    if (this.formularioReset.invalid) {
      this.formularioReset.markAllAsTouched();
      return;
    }

    this.paso = 'codigo';
    this.cdr.detectChanges();
  }

  onSubmitCodigo(): void {
    if (this.formularioCodigo.invalid) {
      this.formularioCodigo.markAllAsTouched();
      return;
    }

    const codigoIngresado = this.formularioCodigo.value.codigo;

    if (codigoIngresado !== CODIGO_VALIDO) {
      this.errorCodigo = 'Código incorrecto. Intenta nuevamente.';
      this.cdr.detectChanges();
      return;
    }

    this.errorCodigo = '';
    this.cargando = true;
    this.mensajeError = '';

    const nuevaContrasena = this.formularioReset.value.nuevaContrasena;

    this.recuperacionService.restablecerContrasena(this.token, nuevaContrasena).subscribe({
      next: (res) => {
        this.cargando = false;
        this.mensajeExito = res.message;
        this.cdr.detectChanges();
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: () => {
        this.cargando = false;
        this.mensajeError = 'No se pudo actualizar la contraseña.';
        this.cdr.detectChanges();
      }
    });
  }

  volverAPassword(): void {
    this.paso = 'password';
    this.formularioCodigo.reset();
    this.errorCodigo = '';
    this.cdr.detectChanges();
  }

  volverALogin(): void {
    this.router.navigate(['/login']);
  }
}