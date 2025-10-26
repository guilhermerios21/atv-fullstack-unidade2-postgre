import express from 'express';
import { json } from 'body-parser';
import config from './config';
import connectDB from './config/db';
import routes from './routes';
import errorMiddleware from './middlewares/error.middleware';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';

const app = express();

// Middlewares
app.use(json());

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'API Docs - JWT + Tasks CRUD',
}));

// Rotas
app.use('/api', routes);

// Health
app.get('/', (_req, res) => {
  res.status(200).json({ message: '✅ API de Autenticação JWT v1.0.0 - Sistema operacional!' });
});

// Error handler
app.use(errorMiddleware);

const PORT = config.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
      console.log(`📚 API Documentation available at http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
