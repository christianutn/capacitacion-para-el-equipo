import 'dotenv/config';
import { z } from 'zod';

// ---------------------------------------------------------------------------
// Schema de validación: garantiza que el proceso arranque solo si el .env
// tiene todo lo requerido. Zod lanza un ZodError descriptivo si algo falta.
// ---------------------------------------------------------------------------
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(4000),

  // Base de datos — desarrollo / test
  DB_NAME_DEV: z.string().optional(),
  DB_USER_DEV: z.string().optional(),
  DB_PASSWORD_DEV: z.string().optional(),
  DB_HOST_DEV: z.string().optional(),
  DB_PORT_DEV: z.coerce.number().default(3306),

  DB_NAME_DESARROLLO: z.string().optional(),
  DB_USER_DESARROLLO: z.string().optional(),
  DB_PASSWORD_DESARROLLO: z.string().optional(),
  DB_HOST_DESARROLLO: z.string().optional(),
  DB_PORT_DESARROLLO: z.coerce.number().default(3306),

  DB_NAME_TEST: z.string().optional(),
  DB_USER_TEST: z.string().optional(),
  DB_PASSWORD_TEST: z.string().optional(),
  DB_HOST_TEST: z.string().optional(),
  DB_PORT_TEST: z.coerce.number().default(3306),

  // Base de datos — producción
  DB_NAME_PROD: z.string().optional(),
  DB_USER_PROD: z.string().optional(),
  DB_PASSWORD_PROD: z.string().optional(),
  DB_HOST_PROD: z.string().optional(),
  DB_PORT_PROD: z.coerce.number().default(3306),

  // Frontend
  URL_PROD_FRONTEND: z.string().optional(),
  URL_TEST_FRONTEND: z.string().optional(),
  URL_LOCAL_FRONTEND: z.string().optional(),

  // Email
  EMAIL_USER: z.string().email().optional(),
  EMAIL_PASS: z.string().optional(),
  EMAIL_SUPPORT_PROD: z.string().optional(),
  EMAIL_SUPPORT_DEV: z.string().optional(),

  // JWT — obligatorio siempre
  JWT_SECRET: z.string().min(16, 'JWT_SECRET debe tener al menos 16 caracteres'),
  JWT_EXPIRES_IN: z.string().default('12h'),

  // Bcrypt
  SALT: z.coerce.number().default(10),

  // Google Drive
  GOOGLE_PRIVATE_KEY: z.string().optional(),
  GOOGLE_CLIENT_EMAIL: z.string().optional(),
  GOOGLE_DRIVE_FOLDER_ID: z.string().optional(),

  // CIDI
  CUIL_OPERADOR_PROD: z.string().optional(),
  CUIL_OPERADOR_TEST: z.string().optional(),
  HASH_COOKIE_OPERADOR_PROD: z.string().optional(),
  HASH_COOKIE_OPERADOR_TEST: z.string().optional(),
  ID_APLICATION_PROD: z.string().optional(),
  ID_APLICATION_TEST: z.string().optional(),
  CONTRASENIA_PROD: z.string().optional(),
  CONTRASENIA_TEST: z.string().optional(),
  KEY_APP_PROD: z.string().optional(),
  KEY_APP_TEST: z.string().optional(),
  URL_API_PROD: z.string().optional(),
  URL_API_TEST: z.string().optional(),
  URL_API_APP_PROD: z.string().optional(),
  URL_API_APP_TEST: z.string().optional(),

  // Monitoring
  MONITORING_ALERT_EMAILS: z.string().optional(),
  EMAIL_RECIPIENTS: z.string().optional(),
  MONITORING_EXTERNAL_ENDPOINTS: z.string().optional(),
});

// Parseamos process.env una sola vez al importar el módulo.
// Si la validación falla, el proceso termina con un mensaje claro.
const _parsed = envSchema.safeParse(process.env);

if (!_parsed.success) {
  console.error('❌ Variables de entorno inválidas:');
  console.error(_parsed.error.flatten().fieldErrors);
  process.exit(1);
}

const env = _parsed.data;
const ENV = env.NODE_ENV;

// ---------------------------------------------------------------------------
// Selección del conjunto de variables de BD según el entorno activo.
// ---------------------------------------------------------------------------
const dbConfig = {
  production: {
    name: env.DB_NAME_PROD,
    user: env.DB_USER_PROD,
    password: env.DB_PASSWORD_PROD,
    host: env.DB_HOST_PROD,
    port: env.DB_PORT_PROD,
  },
  test: {
    name: env.DB_NAME_TEST,
    user: env.DB_USER_TEST,
    password: env.DB_PASSWORD_TEST,
    host: env.DB_HOST_TEST,
    port: env.DB_PORT_TEST,
  },
  development: {
    name: env.DB_NAME_DEV ?? env.DB_NAME_DESARROLLO,
    user: env.DB_USER_DEV ?? env.DB_USER_DESARROLLO,
    password: env.DB_PASSWORD_DEV ?? env.DB_PASSWORD_DESARROLLO,
    host: env.DB_HOST_DEV ?? env.DB_HOST_DESARROLLO,
    port: env.DB_PORT_DEV ?? env.DB_PORT_DESARROLLO,
  },
} as const;

// ---------------------------------------------------------------------------
// Objeto de configuración final exportado (inmutable al consumidor).
// ---------------------------------------------------------------------------
const config = {
  env: ENV,
  isDevelopment: ENV === 'development',
  isTest: ENV === 'test',
  isProduction: ENV === 'production',

  port: env.PORT,

  database: dbConfig[ENV],

  frontend: {
    url:
      ENV === 'production'
        ? env.URL_PROD_FRONTEND
        : env.URL_TEST_FRONTEND ?? env.URL_LOCAL_FRONTEND,
  },

  email: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASS,
    supportEmail:
      ENV === 'production' ? env.EMAIL_SUPPORT_PROD : env.EMAIL_SUPPORT_DEV,
  },

  jwt: {
    secret: env.JWT_SECRET,
    expiresIn: env.JWT_EXPIRES_IN,
  },

  bcrypt: {
    salt: env.SALT,
  },

  googleDrive: {
    privateKey: env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    clientEmail: env.GOOGLE_CLIENT_EMAIL,
    folderId: env.GOOGLE_DRIVE_FOLDER_ID,
  },

  cidi: {
    cuilOperador:
      ENV === 'production' ? env.CUIL_OPERADOR_PROD : env.CUIL_OPERADOR_TEST,
    hashCookieOperador:
      ENV === 'production'
        ? env.HASH_COOKIE_OPERADOR_PROD
        : env.HASH_COOKIE_OPERADOR_TEST,
    idApplication:
      ENV === 'production' ? env.ID_APLICATION_PROD : env.ID_APLICATION_TEST,
    contrasenia:
      ENV === 'production' ? env.CONTRASENIA_PROD : env.CONTRASENIA_TEST,
    keyApp: ENV === 'production' ? env.KEY_APP_PROD : env.KEY_APP_TEST,
    urlApi: ENV === 'production' ? env.URL_API_PROD : env.URL_API_TEST,
    urlApiApp:
      ENV === 'production' ? env.URL_API_APP_PROD : env.URL_API_APP_TEST,
  },

  monitoring: {
    alertEmails: env.MONITORING_ALERT_EMAILS ?? env.EMAIL_RECIPIENTS,
    externalEndpoints: env.MONITORING_EXTERNAL_ENDPOINTS ?? null,
  },
} as const;

export default config;
