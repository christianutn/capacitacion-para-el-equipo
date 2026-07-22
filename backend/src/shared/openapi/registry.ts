import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';

export const registry = new OpenAPIRegistry();

// Registrar esquema de seguridad
export const cookieAuth = registry.registerComponent('securitySchemes', 'cookieAuth', {
  type: 'apiKey',
  in: 'cookie',
  name: 'jwt',
  description: 'Autenticación por cookie JWT',
});

// Agregamos un esquema global para errores, por ejemplo, para reutilizar en respuestas 4xx/5xx
export const errorResponseSchema = registry.register(
  'ErrorResponse',
  // @ts-ignore - ya que está extendido pero TS puede no detectarlo aquí
  require('zod').z.object({
    status: require('zod').z.string().openapi({ example: 'error' }),
    message: require('zod').z.string().openapi({ example: 'Mensaje de error descriptivo' }),
  })
);
