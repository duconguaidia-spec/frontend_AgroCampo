import { Routes } from '@angular/router';
import { RegisterComponent } from './pages/register/register';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'register',
        pathMatch: 'full'
    },
    {
        path: 'register',
        component: RegisterComponent
    },
  {
    path: '',
    loadComponent: () =>
      import('./pages/pagina-de-inicio/pagina-de-inicio').then(
        (m) => m.PaginaDeInicio,
      ),
  },
  {
    path: 'mas-informacion',
    loadComponent: () =>
      import('./pages/mas-informacion/mas-informacion').then(
        (m) => m.MasInformacionComponent,
      ),
  },
  {
    path: '**',
    redirectTo: ''
  }
];
