import express from 'express';
import { json } from 'body-parser';
import routes from '../src/routes';
import errorMiddleware from '../src/middlewares/error.middleware';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from '../src/config/swagger';
import { connectDB } from '../src/config/prisma';
import serverless from 'serverless-http';

const app = express();

// Middlewares
app.use(json());

// Conexão com o banco (mantida entre invocações quando possível)
let connected = false;
app.use(async (_req, _res, next) => {
  if (!connected) {
    try {
      await connectDB();
      connected = true;
    } catch (e) {
      console.error('DB connect error:', e);
    }
  }
  next();
});

// Swagger (acessível em /api/api-docs na Vercel)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'API Docs - JWT + Tasks CRUD',
}));

// Rotas - IMPORTANTe: montadas na raiz da função para evitar /api/api
app.use('/', routes);

// Health simples
app.get('/', (_req, res) => res.status(200).json({ ok: true }));

// Error handler
app.use(errorMiddleware);

export default serverless(app);
