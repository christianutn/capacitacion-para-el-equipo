import { registry, errorResponseSchema } from '../../shared/openapi/registry';
import {
  createAreaSchema,
  updateAreaSchema,
  deleteAreaSchema,
  areaSchema,
} from './area.schemas';
import { z } from 'zod';

const bearerAuth = [{ cookieAuth: [] }];

// GET /areas
registry.registerPath({
  method: 'get',
  path: '/areas',
  tags: ['Áreas'],
  summary: 'Obtener todas las áreas',
  description: 'Retorna un listado de áreas con su ministerio asociado. Soporta filtro por nombre con el parámetro ?busqueda=',
  security: bearerAuth,
  request: {
    query: z.object({
      busqueda: z.string().optional().openapi({
        description: 'Texto de búsqueda para filtrar por nombre',
        example: 'educación',
      }),
    }),
  },
  responses: {
    200: {
      description: 'Lista de áreas',
      content: {
        'application/json': {
          schema: z.array(areaSchema),
        },
      },
    },
    404: {
      description: 'No se encontraron áreas',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
  },
});

// POST /areas
registry.registerPath({
  method: 'post',
  path: '/areas',
  tags: ['Áreas'],
  summary: 'Crear una nueva área',
  description: 'Crea una nueva área asociada a un ministerio existente',
  security: bearerAuth,
  request: {
    body: {
      content: {
        'application/json': {
          schema: createAreaSchema.shape.body,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Área creada exitosamente',
      content: {
        'application/json': {
          schema: areaSchema,
        },
      },
    },
    404: {
      description: 'Ministerio referenciado no encontrado',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
    409: {
      description: 'El código de área ya existe',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
    422: {
      description: 'Error de validación (Zod)',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
  },
});

// PUT /areas
registry.registerPath({
  method: 'put',
  path: '/areas',
  tags: ['Áreas'],
  summary: 'Actualizar un área existente',
  description: 'Actualiza los datos de un área',
  security: bearerAuth,
  request: {
    body: {
      content: {
        'application/json': {
          schema: updateAreaSchema.shape.body,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Área actualizada exitosamente',
      content: {
        'application/json': {
          schema: areaSchema,
        },
      },
    },
    404: {
      description: 'Área no encontrada',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
  },
});

// DELETE /areas/:cod
registry.registerPath({
  method: 'delete',
  path: '/areas/{cod}',
  tags: ['Áreas'],
  summary: 'Eliminar un área',
  description: 'Elimina un área mediante su código',
  security: bearerAuth,
  request: {
    params: deleteAreaSchema.shape.params,
  },
  responses: {
    200: {
      description: 'Área eliminada correctamente',
      content: {
        'application/json': {
          schema: z.object({ message: z.string().openapi({ example: 'Área eliminada correctamente' }) }),
        },
      },
    },
    404: {
      description: 'Área no encontrada',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
  },
});
