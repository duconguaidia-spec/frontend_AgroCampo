import { Routes } from '@angular/router';

import { PaginaDeInicioComponent } from './pages/pagina-de-inicio/pagina-de-inicio';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';
import { InicioComponent } from './pages/informacion-de-inicio/informacion-de-inicio';
import { MasInformacionComponent } from './pages/mas-informacion/mas-informacion';

export const routes: Routes = [
  {
    path: '',
    component: PaginaDeInicioComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'informacion-de-inicio',
    component: InicioComponent
  },
  {
    path: 'mas-informacion',
    component: MasInformacionComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];