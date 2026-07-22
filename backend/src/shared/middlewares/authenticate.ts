import { Request, Response, NextFunction } from 'express';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { verifyToken, JwtPayload } from '../utils/jwt';
import { UnauthorizedError } from '../errors/AppError';

// ---------------------------------------------------------------------------
// Extensión del tipo Request para que los handlers tipados accedan a req.user
// ---------------------------------------------------------------------------
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

/**
 * Middleware de autenticación JWT.
 *
 * Extrae el token de la cookie `jwt` (mismo lugar que el backend viejo).
 * Si el token es válido, adjunta el payload decodificado en `req.user`
 * y cede el control al siguiente middleware.
 *
 * No valida el usuario contra la BD — esa responsabilidad queda en los
 * use-cases o en un middleware de sesión posterior si se necesita.
 *
 * Sustituye a: passport.authenticate('jwt', { session: false })
 */
export const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  try {
    const token: string | undefined = req.cookies?.jwt;

    if (!token) {
      return next(new UnauthorizedError('Token de autenticación no proporcionado'));
    }

    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return next(new UnauthorizedError('El token ha expirado. Vuelva a iniciar sesión.'));
    }
    if (error instanceof JsonWebTokenError) {
      return next(new UnauthorizedError('Token inválido'));
    }
    next(error);
  }
};
