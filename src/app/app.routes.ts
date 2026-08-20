import { Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';
import { PaginaDeInicioComponent} from './pages/pagina-de-inicio/pagina-de-inicio';
import { InicioComponent } from './pages/informacion-de-inicio/informacion-de-inicio';
import { LoginComponent } from './pages/login/login';
import { MasInformacionComponent } from './pages/mas-informacion/mas-informacion';
import { LayoutComponent } from './layout/layout/layout';
import { ModuloComponent } from './pages/modulo/modulo';

export const routes: Routes = [
  {
    path: 'pagina-de-inicio',
    component: PaginaDeInicioComponent,
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
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: InicioComponent,
      },
    ],
  },
  {
    path: 'mas-informacion',
    component: MasInformacionComponent
  },
  {
    path: 'contenido-educativo',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: ModuloComponent,
        data: {
          titulo: 'Contenido educativo',
          descripcion: 'Aquí encontrarás foros de discusión, videos y recursos para fortalecer el conocimiento del sector agropecuario.',
        },
      },
    ],
  },
  {
    path: 'reportes-estadisticas',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: ModuloComponent,
        data: {
          titulo: 'Reportes y estadísticas',
          descripcion: 'Este módulo reunirá los indicadores, paneles visuales y opciones de exportación de datos de AgroCampo.',
        },
      },
    ],
  },
  {
    path: 'perfil',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: ModuloComponent,
        data: {
          titulo: 'Perfil de usuario',
          descripcion: 'Aquí podrás consultar y actualizar la información de tu perfil cuando el módulo esté disponible.',
        },
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'pagina-de-inicio',
  },
];
