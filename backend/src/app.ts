import './shared/openapi/setup'; // Setup temprano de zod-to-openapi
import express, { Application } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import config from './shared/config/env.config';
import { errorHandler } from './shared/middlewares/errorHandler';
import swaggerUi from 'swagger-ui-express';
// import { generateOpenApiDocument } from './shared/openapi/swagger';
import Area from './modules/areas/area.model';


const app: Application = express();
app.set('trust proxy', 1); // Confía en el proxy reverso (Nginx) para express-rate-limit

// ---------------------------------------------------------------------------
// Middlewares globales de seguridad e infraestructura
// ---------------------------------------------------------------------------
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: false,
  }),
);

app.use(
    cors({
        origin: config.frontend.url,
        credentials: true, // Necesario para enviar/recibir cookies con el JWT
    }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Parsea req.cookies (donde vive el token JWT)

// Servir archivos estáticos de la carpeta uploads (PDFs de notas de autorización, etc.)
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// ---------------------------------------------------------------------------
// Rutas
// ---------------------------------------------------------------------------

// Ruta de salud (healthcheck)
app.get('/ping', (_req, res) => {
    res.json({ status: 'ok', message: '¡El backend con TypeScript está vivo! 2' });
});

app.get('/ping-test', (_req, res) => {
    res.json({ status: 'ok', message: 'TEST 2' });
});

app.get('/areas', async (_req, res) => {

    const areas = await  Area.findAll()
    console.log("detalle:", areas)
    res.json({ areas });
});



// Documentación de Swagger
// const openApiDocument = generateOpenApiDocument();
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));
// app.get('/api-docs.json', (req, res) => res.json(openApiDocument));
// ---------------------------------------------------------------------------
// Manejador de errores global — DEBE ir ÚLTIMO
// ---------------------------------------------------------------------------
app.use(errorHandler);

export default app;