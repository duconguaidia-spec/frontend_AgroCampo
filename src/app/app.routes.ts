import { Routes } from '@angular/router';
import { AyudaSoporteComponent } from './pages/ayuda-soporte/ayuda-soporte';
import { EstadisticasComponent } from './pages/estadisticas/estadisticas';
import { ForoComponent } from './pages/foro/foro';
import { InicioComponent } from './pages/informacion-de-inicio/informacion-de-inicio';
import { LoginComponent } from './pages/login/login';
import { MasInformacionComponent } from './pages/mas-informacion/mas-informacion';
import { NoticiasComponent } from './pages/noticias/noticias';
import { PaginaDeInicioComponent } from './pages/pagina-de-inicio/pagina-de-inicio';
import { PerfilComponent } from './pages/perfil/perfil';
import { RegisterComponent } from './pages/register/register';
import { VeterinariasComponent } from './pages/veterinarias/veterinarias';

export const routes: Routes = [
  { path: 'inicio', component: InicioComponent, title: 'AgroCampo | Inicio' },
  { path: 'pagina-de-inicio', component: PaginaDeInicioComponent, title: 'AgroCampo | Bienvenida' },
  { path: 'informacion-de-inicio', redirectTo: 'inicio', pathMatch: 'full' },
  { path: 'estadisticas', component: EstadisticasComponent, title: 'AgroCampo | Estadísticas' },
  { path: 'veterinarias', component: VeterinariasComponent, title: 'AgroCampo | Veterinarias' },
  { path: 'veterinaria', redirectTo: 'veterinarias', pathMatch: 'full' },
  { path: 'noticias', component: NoticiasComponent, title: 'AgroCampo | Noticias' },
  { path: 'foro', component: ForoComponent, title: 'AgroCampo | Foro' },
  { path: 'perfil', component: PerfilComponent, title: 'AgroCampo | Perfil' },
  { path: 'ayuda-soporte', component: AyudaSoporteComponent, title: 'AgroCampo | Ayuda y soporte' },
  { path: 'mas-informacion', component: MasInformacionComponent, title: 'AgroCampo | Más información' },
  { path: 'login', component: LoginComponent, title: 'AgroCampo | Iniciar sesión' },
  { path: 'register', component: RegisterComponent, title: 'AgroCampo | Registro' },
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: '**', redirectTo: 'inicio' },
];
