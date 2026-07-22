import { rateLimit } from 'express-rate-limit';
import { AppError } from '../errors/AppError';

export const loginLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minuto
    max: 5, // Limita a 5 intentos por IP por 'windowMs'
    message: 'Demasiados intentos de inicio de sesión, por favor intenta nuevamente más tarde.',
    standardHeaders: true, // Reemplaza headers: true en v6+
    legacyHeaders: false,
    handler: (_req, _res, next) => {
        next(new AppError('Demasiados intentos de inicio de sesión, por favor intenta nuevamente más tarde.', 429));
    },
});

export const publicApiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minuto
    max: 30, // 30 solicitudes por IP por minuto
    message: 'Demasiadas solicitudes, intente nuevamente más tarde.',
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req, _res, next) => {
        next(new AppError('Demasiadas solicitudes, intente nuevamente más tarde.', 429));
    },
});
