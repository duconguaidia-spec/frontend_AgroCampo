import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { AutenticacionService, RolUsuario } from '../../services/autenticacion';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})

export class RegisterComponent {
  registerForm: FormGroup;
  cargando = false;
  errorServidor: string | null = null;
  mostrarPassword = false;
  mostrarConfirmarPassword = false;
  tiposUsuario = ['Veterinario Registrado', 'Usuario General'];

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private autenticacion: AutenticacionService,
  ) {
    this.registerForm = this.fb.group({
      nombre: ['', [Validators.required,  Validators.minLength(3)]],
      apellido: ['', [Validators.required, Validators.minLength(3)]],
      tipoUsuario: ['', [Validators.required]],
      telefono: ['', [Validators.pattern('^[0-9]{10}$')]],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*]).+$')
      ]],
      confirmarPassword: ['', [Validators.required]]
    },{
      validators: this.passwordIguales
    });
  }
  passwordIguales(form: AbstractControl): ValidationErrors | null {
    const password = form.get('password')?.value;
    const confirmar = form.get('confirmarPassword')?.value;

    if (password === confirmar){
      return null;
    }
    return {
      passwordNoCoincide: true
    };
  }
  get nombre(){
    return this.registerForm.get('nombre');
  }

  get apellido() {
    return this.registerForm.get('apellido');
  }

  get tipoUsuario() {
  return this.registerForm.get('tipoUsuario');
  }

  get telefono() {
  return this.registerForm.get('telefono');
  }

  get correo() {
    return this.registerForm.get('correo');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get confirmarPassword() {
    return this.registerForm.get('confirmarPassword');
  }

  registroUsuario(): void {

    // Validación: si el formulario es inválido, no se envía nada
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const datos = this.registerForm.getRawValue();
    const rol: RolUsuario = datos.tipoUsuario === 'Veterinario Registrado' ? 'veterinario' : 'usuario';
    const registrado = this.autenticacion.registrarUsuario({
      nombre: `${datos.nombre?.trim()} ${datos.apellido?.trim()}`,
      correo: datos.correo?.trim() ?? '',
      contrasena: datos.password ?? '',
      rol,
    });

    if (!registrado) {
      this.errorServidor = 'Ya existe una cuenta registrada con este correo.';
      return;
    }

    alert('Usuario registrado. Ahora puedes iniciar sesión.');
    this.router.navigate(['/login']);
  }
  inicioSesion(): void{
    this.router.navigate(['/login']);
  }
  register(): void{
    this.router.navigate(['/register']);
  }
}


