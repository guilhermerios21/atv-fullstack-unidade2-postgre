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

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'API Docs - JWT + Tasks CRUD',
}));

// Health na raiz
app.get('/', (_req, res) => res.status(200).json({ ok: true, message: 'API PostgreSQL rodando' }));

// Rotas montadas em /api para consistência com local
app.use('/api', routes);

// Error handler
app.use(errorMiddleware);

export default serverless(app);
