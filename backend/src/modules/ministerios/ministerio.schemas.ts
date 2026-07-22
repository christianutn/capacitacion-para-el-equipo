import '../../shared/openapi/setup';
import { z } from 'zod';
import { registry } from '../../shared/openapi/registry';

const codSchema = z.string().trim().min(1, 'El código es requerido').max(15).openapi({
  description: 'Código identificador único del ministerio',
  example: 'MIN_EDUC',
});

const nombreSchema = z.string().trim().min(1, 'El nombre es requerido').max(100).openapi({
  description: 'Nombre del ministerio',
  example: 'Ministerio de Educación',
});

const esVigenteSchema = z
  .union([
    z.boolean(),
    z.literal('Si'), z.literal('si'),
    z.literal('No'), z.literal('no'),
    z.literal(1), z.literal(0),
    z.literal('1'), z.literal('0'),
  ])
  .optional()
  .openapi({
    description: 'Indica si el ministerio está vigente',
    example: 1,
  });

export const ministerioSchema = registry.register(
  'Ministerio',
  z.object({
    cod: codSchema,
    nombre: nombreSchema,
    esVigente: esVigenteSchema,
  }),
);

/** POST /ministerios */
export const createMinisterioSchema = z.object({
  body: z.object({
    cod: codSchema,
    nombre: nombreSchema,
  }),
});

/** PUT /ministerios */
export const updateMinisterioSchema = z.object({
  body: z.object({
    cod: codSchema,
    nombre: nombreSchema,
    esVigente: esVigenteSchema,
  }),
});

/** DELETE /ministerios/:cod */
export const deleteMinisterioSchema = z.object({
  params: z.object({
    cod: codSchema,
  }),
});

/** GET /ministerios/:cod */
export const getMinisterioByCodSchema = z.object({
  params: z.object({
    cod: codSchema,
  }),
});

export type CreateMinisterioDto = z.infer<typeof createMinisterioSchema>['body'];
export type UpdateMinisterioDto = z.infer<typeof updateMinisterioSchema>['body'];
