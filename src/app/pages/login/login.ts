import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  mostrarContrasena = false;

  loginForm;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router
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

    console.log('Datos de inicio de sesión:', this.loginForm.value);

    // Aquí conectarás posteriormente tu servicio y API de autenticación.
  }

  campoInvalido(campo: 'correo' | 'contrasena'): boolean {
    const control = this.loginForm.get(campo);
    return !!control && control.invalid && control.touched;
  }
  inicioSesion(): void{
    this.router.navigate(['/login']);
  }
  register(): void{
    this.router.navigate(['/register']);
  }
}