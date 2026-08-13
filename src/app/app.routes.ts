import { Routes } from '@angular/router';

export const routes: Routes = [
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
