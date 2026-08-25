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

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'AgroCampo | Inicio' },
  { path: 'home', redirectTo: '', pathMatch: 'full' },
  { path: 'pagina-de-inicio', component: PaginaDeInicioComponent, title: 'AgroCampo | Bienvenida' },
  { path: 'estadisticas', component: EstadisticasComponent, title: 'AgroCampo | Estadísticas' },
  { path: 'veterinarias/registrar', component: AgregarVeterinariaComponent, title: 'AgroCampo | Agregar Veterinaria' },
  { path: 'veterinarias/:id', component: VeterinariaDetalleComponent, title: 'AgroCampo | Veterinaria' },
  { path: 'veterinarias', component: VeterinariasComponent, title: 'AgroCampo | Veterinarias' },
  { path: 'veterinaria', redirectTo: 'veterinarias', pathMatch: 'full' },
  { path: 'noticias', component: NoticiasComponent, title: 'AgroCampo | Noticias' },
  { path: 'noticias/:id', component: NoticiaDetalleComponent, title: 'AgroCampo | Noticia' },
  { path: 'foro', component: ForoComponent, title: 'AgroCampo | Foro' },
  { path: 'videos-explicativos', component: VideosExplicativosComponent, title: 'AgroCampo | Videos explicativos' },
  { path: 'perfil', component: PerfilComponent, title: 'AgroCampo | Perfil' },
  { path: 'ayuda-soporte', component: AyudaSoporteComponent, title: 'AgroCampo | Ayuda y soporte' },
  { path: 'mas-informacion', component: MasInformacionComponent, title: 'AgroCampo | Más información' },
  { path: 'login', component: LoginComponent, title: 'AgroCampo | Iniciar sesión' },
  { path: 'register', component: RegisterComponent, title: 'AgroCampo | Registro' },
  { path: 'recuperacion-contrasena', component: RecuperacionContrasenaComponent, title: 'AgroCampo | Recuperar contraseña' },
  { path: 'restablecer-contrasena/:token', component: RestablecerContrasenaComponent, title: 'AgroCampo | Restablecer contraseña' },
  { path: '**', redirectTo: '' },
];