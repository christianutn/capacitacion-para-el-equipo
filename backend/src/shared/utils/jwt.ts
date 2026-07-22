import jwt from 'jsonwebtoken';
import config from '../config/env.config';

// ---------------------------------------------------------------------------
// Tipos — describe la forma del payload que firmamos en el token
// ---------------------------------------------------------------------------

export interface JwtUserPayload {
  cuil: string;
  rol: string;
  area?: string;
  id_rol?: number;
  token_version: number;
  [key: string]: unknown;
}

export interface JwtPayload {
  user: JwtUserPayload;
  iat?: number;
  exp?: number;
}

// ---------------------------------------------------------------------------
// Utilidades JWT
// ---------------------------------------------------------------------------

/**
 * Firma un token JWT con los datos del usuario.
 * La clave y expiración se toman de la configuración centralizada.
 */
export const generateToken = (user: JwtUserPayload): string => {
  return jwt.sign({ user }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn as jwt.SignOptions['expiresIn'],
  });
};

/**
 * Verifica y decodifica un token JWT.
 * Lanza `JsonWebTokenError` o `TokenExpiredError` si es inválido.
 */
export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, config.jwt.secret) as JwtPayload;
};
