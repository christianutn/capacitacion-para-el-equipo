// src/errors/sequelizeErrorHandler.ts
import { Response } from 'express';
import {
  BaseError,
  UniqueConstraintError,
  ForeignKeyConstraintError,
  ValidationError,
} from 'sequelize';

export const SequelizeError = (error: BaseError, res: Response): void => {
  // Violación de restricción UNIQUE
  if (error instanceof UniqueConstraintError) {
    res.status(409).json({
      status: 'error',
      message: 'El registro ya existe.',
      details: error.errors.map((e) => e.message),
    });
    return;
  }

  // Violación de llave foránea
  if (error instanceof ForeignKeyConstraintError) {
    res.status(400).json({
      status: 'error',
      message: 'El registro hace referencia a una entidad que no existe.',
    });
    return;
  }

  // Errores de validación de modelos
  if (error instanceof ValidationError) {
    res.status(422).json({
      status: 'error',
      message: 'Error de validación en el modelo de datos.',
      details: error.errors.map((e) => e.message),
    });
    return;
  }

  // Fallo interno de la base de datos
  console.error('🛢️ Error interno de DB (Sequelize):', error);
  res.status(500).json({
    status: 'error',
    message: 'Error interno de la base de datos',
  });
};