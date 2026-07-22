import '../../shared/openapi/setup';
import { z } from 'zod';
import { registry } from '../../shared/openapi/registry';

const codSchema = z.string().trim().min(1, 'El código es requerido').max(15).openapi({
  description: 'Código identificador único del área',
  example: 'AREA_EDU_01',
});

const nombreSchema = z.string().trim().min(1, 'El nombre es requerido').max(250).openapi({
  description: 'Nombre del área',
  example: 'Dirección General de Educación Superior',
});

const ministerioSchema = z.string().trim().min(1, 'El ministerio es requerido').max(15).openapi({
  description: 'Código del ministerio al que pertenece el área',
  example: 'MIN_EDUC',
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
    description: 'Indica si el área está vigente',
    example: 1,
  });

const busquedaSchema = z.string().trim().optional().openapi({
  description: 'Texto de búsqueda para filtrar áreas por nombre',
  example: 'educación',
});

export const areaSchema = registry.register(
  'Area',
  z.object({
    cod: codSchema,
    nombre: nombreSchema,
    ministerio: ministerioSchema,
    esVigente: esVigenteSchema,
  }),
);

/** GET /areas?busqueda= */
export const getAreasQuerySchema = z.object({
  query: z.object({
    busqueda: busquedaSchema,
  }),
});

/** POST /areas */
export const createAreaSchema = z.object({
  body: z.object({
    cod: codSchema,
    nombre: nombreSchema,
    ministerio: ministerioSchema,
  }),
});

/** PUT /areas */
export const updateAreaSchema = z.object({
  body: z.object({
    cod: codSchema,
    nombre: nombreSchema,
    ministerio: ministerioSchema,
    esVigente: esVigenteSchema,
  }),
});

/** DELETE /areas/:cod */
export const deleteAreaSchema = z.object({
  params: z.object({
    cod: codSchema,
  }),
});

export type CreateAreaDto = z.infer<typeof createAreaSchema>['body'];
export type UpdateAreaDto = z.infer<typeof updateAreaSchema>['body'];
