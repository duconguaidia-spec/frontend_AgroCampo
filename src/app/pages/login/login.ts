import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AutenticacionService, UsuarioRegistrado } from '../../services/autenticacion';

const CUENTAS_DEMOSTRACION: UsuarioRegistrado[] = [
  { nombre: 'Administración AgroCampo', correo: 'admin@agrocampo.co', contrasena: 'Admin2026!', rol: 'administrador' },
  { nombre: 'Veterinaria AgroCampo', correo: 'veterinaria@agrocampo.co', contrasena: 'Veterinaria2026!', rol: 'veterinario' },
  { nombre: 'Usuario AgroCampo', correo: 'usuario@agrocampo.co', contrasena: 'Usuario2026!', rol: 'usuario' },
];


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  mostrarContrasena = false;
  mensajeError = '';

  loginForm;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private autenticacion: AutenticacionService,
  ) {
    this.loginForm = this.formBuilder.group({
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(6)]],
      recordarme: [false],
    });
  }

  iniciarSesion(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { correo, contrasena } = this.loginForm.getRawValue();
    if (!this.autenticacion.iniciarSesion(correo ?? '', contrasena ?? '', CUENTAS_DEMOSTRACION)) {
      this.mensajeError = 'El correo o la contraseña no coinciden con una cuenta registrada.';
      return;
    }

    const retorno = this.route.snapshot.queryParamMap.get('retorno');
    this.router.navigateByUrl(retorno || '/inicio');
  }

  campoInvalido(campo: 'correo' | 'contrasena'): boolean {
    const control = this.loginForm.get(campo);
    return !!control && control.invalid && control.touched;
  }
  inicioSesion(): void {
    this.router.navigate(['/login']);
  }
  register(): void {
    this.router.navigate(['/register']);
  }
  recuperarContrasena(): void {
    this.router.navigate(['/recuperacion-contrasena']);
  }
}
