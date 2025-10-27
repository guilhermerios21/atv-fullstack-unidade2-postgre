import swaggerJSDoc from 'swagger-jsdoc';
const version = process.env.npm_package_version || '1.0.0';
import path from 'path';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Autenticação JWT + CRUD de Tarefas',
      version,
      description:
        'API RESTful com autenticação JWT, gerenciamento de usuários e CRUD completo de tarefas (To-Do List). Desenvolvida com Node.js, TypeScript, Express e PostgreSQL (Prisma).',
      contact: { name: 'Atividade Fullstack - Unidade 2' },
      license: { name: 'MIT' },
    },
    servers: [
      { url: 'http://localhost:3000', description: 'Servidor de Desenvolvimento' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Insira o token JWT obtido no endpoint /api/login',
        },
      },
    },
    security: [],
  },
  apis: [
    path.join(__dirname, '../routes/auth.routes.ts'),
    path.join(__dirname, '../routes/task.routes.ts'),
    path.join(__dirname, '../routes/user.routes.ts'),
  ],
};

export const swaggerSpec = swaggerJSDoc(options);
