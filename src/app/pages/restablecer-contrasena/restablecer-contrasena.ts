import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RecuperacionContrasenaService } from '../../services/recuperacion-contrasena';

// Validador a nivel de grupo: confirma que las contraseñas coincidan
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
  formularioReset: FormGroup;
  token: string = '';
  cargando = false;
  mensajeExito = '';
  mensajeError = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private recuperacionService: RecuperacionContrasenaService
  ) {
    this.formularioReset = this.fb.group({
      nuevaContrasena: ['', [Validators.required, Validators.minLength(6)]],
      confirmarContrasena: ['', Validators.required]
    }, { validators: contrasenasCoincidenValidator });
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

  onSubmit(): void {
    if (this.formularioReset.invalid) {
      this.formularioReset.markAllAsTouched();
      return;
    }

    this.cargando = true;
    this.mensajeError = '';

    const nuevaContrasena = this.formularioReset.value.nuevaContrasena;

    this.recuperacionService.restablecerContrasena(this.token, nuevaContrasena).subscribe({
      next: (res) => {
        this.cargando = false;
        this.mensajeExito = res.message;
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: () => {
        this.cargando = false;
        this.mensajeError = 'No se pudo actualizar la contraseña.';
      }
    });
  }
}