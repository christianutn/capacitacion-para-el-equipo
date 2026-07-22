import { registry, errorResponseSchema } from '../../shared/openapi/registry';
import {
  createMinisterioSchema,
  updateMinisterioSchema,
  deleteMinisterioSchema,
  getMinisterioByCodSchema,
  ministerioSchema,
} from './ministerio.schemas';
import { z } from 'zod';

const bearerAuth = [{ cookieAuth: [] }];

// GET /ministerios
registry.registerPath({
  method: 'get',
  path: '/ministerios',
  tags: ['Ministerios'],
  summary: 'Obtener todos los ministerios',
  description: 'Retorna un listado completo de todos los ministerios con sus áreas asociadas',
  security: bearerAuth,
  responses: {
    200: {
      description: 'Lista de ministerios',
      content: {
        'application/json': {
          schema: z.array(ministerioSchema),
        },
      },
    },
    404: {
      description: 'No se encontraron ministerios',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
  },
});

// GET /ministerios/:cod
registry.registerPath({
  method: 'get',
  path: '/ministerios/{cod}',
  tags: ['Ministerios'],
  summary: 'Obtener un ministerio por código',
  description: 'Retorna un ministerio específico con sus áreas asociadas',
  security: bearerAuth,
  request: {
    params: getMinisterioByCodSchema.shape.params,
  },
  responses: {
    200: {
      description: 'Ministerio encontrado',
      content: {
        'application/json': {
          schema: ministerioSchema,
        },
      },
    },
    404: {
      description: 'Ministerio no encontrado',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
  },
});

// POST /ministerios
registry.registerPath({
  method: 'post',
  path: '/ministerios',
  tags: ['Ministerios'],
  summary: 'Crear un nuevo ministerio',
  description: 'Crea un nuevo ministerio',
  security: bearerAuth,
  request: {
    body: {
      content: {
        'application/json': {
          schema: createMinisterioSchema.shape.body,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Ministerio creado exitosamente',
      content: {
        'application/json': {
          schema: ministerioSchema,
        },
      },
    },
    409: {
      description: 'El código o nombre ya existe',
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

// PUT /ministerios
registry.registerPath({
  method: 'put',
  path: '/ministerios',
  tags: ['Ministerios'],
  summary: 'Actualizar un ministerio existente',
  description: 'Actualiza los datos de un ministerio. Soporta cambio de código con newCod.',
  security: bearerAuth,
  request: {
    body: {
      content: {
        'application/json': {
          schema: updateMinisterioSchema.shape.body,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Ministerio actualizado exitosamente',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string().openapi({ example: 'Ministerio actualizado correctamente' }),
            ministerio: ministerioSchema,
          }),
        },
      },
    },
    404: {
      description: 'Ministerio no encontrado',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
  },
});

// DELETE /ministerios/:cod
registry.registerPath({
  method: 'delete',
  path: '/ministerios/{cod}',
  tags: ['Ministerios'],
  summary: 'Eliminar un ministerio',
  description: 'Elimina un ministerio mediante su código. Las áreas asociadas se eliminan en cascada.',
  security: bearerAuth,
  request: {
    params: deleteMinisterioSchema.shape.params,
  },
  responses: {
    200: {
      description: 'Ministerio eliminado correctamente',
      content: {
        'application/json': {
          schema: z.object({ message: z.string().openapi({ example: 'Ministerio eliminado' }) }),
        },
      },
    },
    404: {
      description: 'Ministerio no encontrado',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
  },
});
