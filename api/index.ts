import express from 'express';
import { json } from 'body-parser';
import routes from '../src/routes';
import errorMiddleware from '../src/middlewares/error.middleware';

const app = express();

// Middlewares
app.use(json());

// Health na raiz
app.get('/', (_req, res) => res.status(200).json({ ok: true, message: 'API PostgreSQL rodando' }));

// Rotas montadas em /api
app.use('/api', routes);

// Error handler
app.use(errorMiddleware);

// Export do handler para Vercel (sem serverless-http por enquanto)
export default app;
