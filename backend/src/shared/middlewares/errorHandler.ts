import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../errors/AppError';
import { SequelizeError } from '../errors/sequelizeError';
import { BaseError } from 'sequelize';

/**
 * Manejador de errores global (debe registrarse ÚLTIMO en app.ts).
 *
 * Cubre tres tipos de errores:
 * 1. AppError  → errores operacionales propios (lanzados explícitamente).
 * 2. ZodError  → fallos de validación del schema (body/params/query).
 * 3. SequelizeError → errores relacionados con la base de datos (violaciones de restricciones, etc).
 * 4. Error     → cualquier otro error inesperado → 500 Internal Server Error.
 */
export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void => {
  // --- 1. Errores operacionales propios ---
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      status: 'error',
      message: error.message,
    });
    return;
  }

  // --- 2. Errores de validación Zod ---
  if (error instanceof ZodError) {
    res.status(422).json({
      status: 'error',
      message: 'Error de validación',
      errors: error.flatten().fieldErrors,
    });
    return;
  }

  // --- 3. Errores de Sequelize (DB) ---
  if (error instanceof BaseError) {
    return SequelizeError(error, res);
  }

  // --- 4. Error inesperado (bug) ---
  console.error('❌ Error inesperado:', error);
  res.status(500).json({
    status: 'error',
    message: 'Error interno del servidor',
  });
};
