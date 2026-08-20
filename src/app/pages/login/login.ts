import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';


interface UsuarioPrueba {
  correo: string;
  contrasena: string;
  nombre: string;
  rol: 'Administrador' | 'Veterinario' | 'Usuario';
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  mostrarContrasena = false;
  errorLogin = '';

  loginForm;

  // Usuarios quemados para probar el flujo mientras no hay backend
  private usuariosPrueba: UsuarioPrueba[] = [
    { 
      correo: 'admin@sena.com', 
      contrasena: '123456', 
      nombre: 'Admin Agrocampo', 
      rol: 'Administrador' 
    },
    { 
      correo: 'instructor@agrocampo.com', 
      contrasena: '123456', 
      nombre: 'Instructor Agrocampo', 
      rol: 'Veterinario' 
    },
    { 
      correo: 'aprendiz@agrocampo.com', 
      contrasena: '123456', 
      nombre: 'Aprendiz Agrocampo', 
      rol: 'Usuario' },
  ];

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
    this.errorLogin = '';

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { correo, contrasena } = this.loginForm.value;

    const usuarioEncontrado = this.usuariosPrueba.find(
      (u) => u.correo === correo && u.contrasena === contrasena
    );

    if (!usuarioEncontrado) {
      this.errorLogin = 'Correo o contraseña incorrectos.';
      return;
    }

    // Aquí luego guardarás el token/usuario real que devuelva tu API
    localStorage.setItem('usuarioActual', JSON.stringify(usuarioEncontrado));

    this.router.navigate(['/informacion-de-inicio']);
  }

  campoInvalido(campo: 'correo' | 'contrasena'): boolean {
    const control = this.loginForm.get(campo);
    return !!control && control.invalid && control.touched;
  }

  register(): void {
    this.router.navigate(['/register']);
  }
}
