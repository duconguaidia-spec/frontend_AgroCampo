import { Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';
import { PaginaDeInicio } from './pages/pagina-de-inicio/pagina-de-inicio';
import { InicioComponent } from './pages/informacion-de-inicio/informacion-de-inicio';
import { MasInformacionComponent } from './pages/mas-informacion/mas-informacion';

export const routes: Routes = [
  {
    path: 'pagina-de-inicio',
    component: PaginaDeInicio,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'informacion-de-inicio',
    component: InicioComponent,
  },
  {
    path: 'mas-informacion',
    component: MasInformacionComponent,
  },
  {
    path: '',
    redirectTo: 'pagina-de-inicio',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'pagina-de-inicio',
  },
];