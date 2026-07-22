import { Request, Response, NextFunction } from 'express';
import { ForbiddenError, UnauthorizedError } from '../errors/AppError';

/**
 * Middleware de autorización basado en roles.
 *
 * Debe usarse SIEMPRE después de `authenticate`.
 * Verifica que el rol del usuario autenticado esté en la lista permitida.
 *
 * Uso en rutas:
 *   router.get('/recurso', authenticate, authorize(['ADM', 'REF']), handler)
 *
 * Sustituye a: autorizar(['ADM', 'REF', 'GA']) del backend viejo
 *
 * @param allowedRoles Lista de roles autorizados para acceder al recurso.
 */
export const authorize = (allowedRoles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const rol = req.user?.user?.rol;

    if (!req.user || !rol) {
      return next(new UnauthorizedError('Usuario no autenticado o rol no definido'));
    }

    if (!allowedRoles.includes(rol)) {
      return next(
        new ForbiddenError(
          `Acceso denegado. Se requiere uno de los siguientes roles: ${allowedRoles.join(', ')}`,
        ),
      );
    }

    next();
  };
};
