import { Routes } from '@angular/router';
import { AyudaSoporteComponent } from './pages/ayuda-soporte/ayuda-soporte';
import { EstadisticasComponent } from './pages/estadisticas/estadisticas';
import { ForoComponent } from './pages/foro/foro';
import { LoginComponent } from './pages/login/login';
import { MasInformacionComponent } from './pages/mas-informacion/mas-informacion';
import { NoticiasComponent } from './pages/noticias/noticias';
import { NoticiaDetalleComponent } from './pages/noticia-detalle/noticia-detalle';
import { PaginaDeInicioComponent } from './pages/pagina-de-inicio/pagina-de-inicio';
import { PerfilComponent } from './pages/perfil/perfil';
import { RegisterComponent } from './pages/register/register';
import { VeterinariasComponent } from './pages/veterinarias/veterinarias';
import { HomeComponent } from './pages/Home/home';
import { VeterinariaDetalleComponent } from './pages/veterinaria-detalle/veterinaria-detalle';
import { AgregarVeterinariaComponent } from './pages/veterinaria_registrar/veterinaria_registrar';
import { VideosExplicativosComponent } from './pages/videos-explicativos/videos-explicativos';
import { RecuperacionContrasenaComponent } from './pages/recuperacion-contrasena/recuperacion-contrasena';
import { RestablecerContrasenaComponent } from './pages/restablecer-contrasena/restablecer-contrasena';
import { accesoGuard, rolGuard } from './guards/acceso.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'pagina-de-inicio', pathMatch: 'full' },
  { path: 'home', redirectTo: 'inicio', pathMatch: 'full' },
  { path: 'pagina-de-inicio', component: PaginaDeInicioComponent, title: 'AgroCampo | Bienvenida' },
  { path: 'inicio', component: HomeComponent, canActivate: [accesoGuard], title: 'AgroCampo | Inicio' },
  { path: 'estadisticas', component: EstadisticasComponent, canActivate: [accesoGuard], title: 'AgroCampo | Estadísticas' },
  { path: 'veterinarias/registrar', component: AgregarVeterinariaComponent, canActivate: [rolGuard], data: { roles: ['administrador', 'veterinario'] }, title: 'AgroCampo | Agregar Veterinaria' },
  { path: 'veterinarias/:id', component: VeterinariaDetalleComponent, canActivate: [accesoGuard], title: 'AgroCampo | Veterinaria' },
  { path: 'veterinarias', component: VeterinariasComponent, canActivate: [accesoGuard], title: 'AgroCampo | Veterinarias' },
  { path: 'veterinaria', redirectTo: 'veterinarias', pathMatch: 'full' },
  { path: 'noticias', component: NoticiasComponent, canActivate: [accesoGuard], title: 'AgroCampo | Noticias' },
  { path: 'noticias/:id', component: NoticiaDetalleComponent, canActivate: [accesoGuard], title: 'AgroCampo | Noticia' },
  { path: 'foro', component: ForoComponent, canActivate: [accesoGuard], title: 'AgroCampo | Foro' },
  { path: 'videos-explicativos', component: VideosExplicativosComponent, canActivate: [accesoGuard], title: 'AgroCampo | Videos explicativos' },
  { path: 'perfil', component: PerfilComponent, canActivate: [accesoGuard], title: 'AgroCampo | Perfil' },
  { path: 'ayuda-soporte', component: AyudaSoporteComponent, canActivate: [accesoGuard], title: 'AgroCampo | Ayuda y soporte' },
  { path: 'mas-informacion', component: MasInformacionComponent, canActivate: [accesoGuard], title: 'AgroCampo | Más información' },
  { path: 'login', component: LoginComponent, title: 'AgroCampo | Iniciar sesión' },
  { path: 'register', component: RegisterComponent, title: 'AgroCampo | Registro' },
  { path: 'recuperacion-contrasena', component: RecuperacionContrasenaComponent, title: 'AgroCampo | Recuperar contraseña' },
  { path: 'restablecer-contrasena/:token', component: RestablecerContrasenaComponent, title: 'AgroCampo | Restablecer contraseña' },
  { path: '**', redirectTo: 'pagina-de-inicio' },
];
