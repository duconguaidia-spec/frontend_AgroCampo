import { Component, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AutenticacionService } from '../../services/autenticacion';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  mostrarContrasena = false;
  readonly errorSesion = signal('');
  get mensajeError(): string { return this.errorSesion(); }
  readonly ingresando = signal(false);

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
    if (this.ingresando()) return;
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { correo, contrasena } = this.loginForm.getRawValue();
    this.ingresando.set(true);
    this.errorSesion.set('');
    this.autenticacion.iniciarSesion(correo ?? '', contrasena ?? '').subscribe({
      next: () => {
        this.ingresando.set(false);
        const retorno = this.route.snapshot.queryParamMap.get('retorno');
        void this.router.navigateByUrl(retorno?.startsWith('/') && !retorno.startsWith('//') ? retorno : '/inicio');
      },
      error: (error) => {
        this.ingresando.set(false);
        this.errorSesion.set(error.error?.message || 'No se pudo iniciar sesión. Comprueba que la MID y Usuarios estén activos.');
      },
    });
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
