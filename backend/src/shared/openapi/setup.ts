import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

// Extendemos Zod antes de que cualquier esquema sea evaluado.
extendZodWithOpenApi(z);
