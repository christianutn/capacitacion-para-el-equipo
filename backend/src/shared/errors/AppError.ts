/**
 * Error base de la aplicación.
 * Todas las clases de error personalizadas extienden de ésta.
 * Facilita la detección en el errorHandler: `error instanceof AppError`.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  /** Si true, el error es "operacional" (esperado); si false, es un bug. */
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    // Restaura el prototipo correctamente en clases que extienden Error en TS.
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

// ---------------------------------------------------------------------------
// Errores HTTP concretos — listos para usar en controllers y use-cases
// ---------------------------------------------------------------------------

/** 400 Bad Request */
export class BadRequestError extends AppError {
  constructor(message = 'Solicitud inválida') {
    super(message, 400);
  }
}

/** 401 Unauthorized — el usuario no está autenticado */
export class UnauthorizedError extends AppError {
  constructor(message = 'No autenticado') {
    super(message, 401);
  }
}

/** 403 Forbidden — el usuario está autenticado pero no tiene permiso */
export class ForbiddenError extends AppError {
  constructor(message = 'Acceso denegado') {
    super(message, 403);
  }
}

/** 404 Not Found */
export class NotFoundError extends AppError {
  constructor(message = 'Recurso no encontrado') {
    super(message, 404);
  }
}

/** 409 Conflict */
export class ConflictError extends AppError {
  constructor(message = 'Conflicto con el estado actual del recurso') {
    super(message, 409);
  }
}

/** 422 Unprocessable Entity — validación de negocio fallida */
export class ValidationError extends AppError {
  constructor(message = 'Error de validación') {
    super(message, 422);
  }
}
