import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AutenticacionService, RolUsuario } from '../services/autenticacion';

export const accesoGuard: CanActivateFn = (_route, estado) => {
  const autenticacion = inject(AutenticacionService);
  const router = inject(Router);

  return autenticacion.autenticado()
    ? true
    : router.createUrlTree(['/login'], { queryParams: { retorno: estado.url } });
};

export const rolGuard: CanActivateFn = (ruta) => {
  const autenticacion = inject(AutenticacionService);
  const router = inject(Router);
  const roles = ruta.data?.['roles'] as RolUsuario[] | undefined;

  if (!autenticacion.autenticado()) {
    return router.createUrlTree(['/login']);
  }

  return !roles || autenticacion.tieneRol(roles)
    ? true
    : router.createUrlTree(['/inicio']);
};
