"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpec = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const package_json_1 = require("../../package.json");
const path_1 = __importDefault(require("path"));
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API de Autenticação JWT + CRUD de Tarefas',
            version: package_json_1.version,
            description: 'API RESTful com autenticação JWT, gerenciamento de usuários e CRUD completo de tarefas (To-Do List). Desenvolvida com Node.js, TypeScript, Express e MongoDB.',
            contact: {
                name: 'Atividade Fullstack - Unidade 2',
            },
            license: {
                name: 'MIT',
            },
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Servidor de Desenvolvimento',
            },
            {
                url: 'https://backend-express-conference-ticket-guilhermerios.tech',
                description: 'Servidor de Produção (Vercel)',
            },
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
            schemas: {
                User: {
                    type: 'object',
                    required: ['name', 'email', 'password'],
                    properties: {
                        _id: {
                            type: 'string',
                            description: 'ID único do usuário (gerado automaticamente)',
                            example: '507f1f77bcf86cd799439011',
                        },
                        name: {
                            type: 'string',
                            description: 'Nome completo do usuário',
                            example: 'João Silva',
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            description: 'Email único do usuário',
                            example: 'joao.silva@example.com',
                        },
                        password: {
                            type: 'string',
                            format: 'password',
                            minLength: 6,
                            description: 'Senha do usuário (mínimo 6 caracteres)',
                            example: 'senha123',
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Data de criação',
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Data da última atualização',
                        },
                    },
                },
                Task: {
                    type: 'object',
                    required: ['title'],
                    properties: {
                        _id: {
                            type: 'string',
                            description: 'ID único da tarefa',
                            example: '507f1f77bcf86cd799439022',
                        },
                        userId: {
                            type: 'string',
                            description: 'ID do usuário dono da tarefa',
                            example: '507f1f77bcf86cd799439011',
                        },
                        title: {
                            type: 'string',
                            minLength: 3,
                            maxLength: 200,
                            description: 'Título da tarefa (3-200 caracteres)',
                            example: 'Estudar Node.js',
                        },
                        description: {
                            type: 'string',
                            description: 'Descrição detalhada da tarefa',
                            example: 'Revisar Express e MongoDB',
                        },
                        status: {
                            type: 'string',
                            enum: ['pending', 'in_progress', 'completed', 'cancelled'],
                            default: 'pending',
                            description: 'Status atual da tarefa',
                            example: 'pending',
                        },
                        priority: {
                            type: 'string',
                            enum: ['low', 'medium', 'high', 'urgent'],
                            default: 'medium',
                            description: 'Prioridade da tarefa',
                            example: 'high',
                        },
                        dueDate: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Data de vencimento da tarefa',
                            example: '2025-10-30T23:59:59.000Z',
                        },
                        tags: {
                            type: 'array',
                            items: { type: 'string' },
                            description: 'Tags/categorias da tarefa',
                            example: ['estudos', 'backend'],
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Data de criação',
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Data da última atualização',
                        },
                    },
                },
                Error: {
                    type: 'object',
                    properties: {
                        message: {
                            type: 'string',
                            description: 'Mensagem de erro',
                            example: 'Erro ao processar requisição',
                        },
                    },
                },
                LoginResponse: {
                    type: 'object',
                    properties: {
                        message: {
                            type: 'string',
                            example: 'Login realizado com sucesso',
                        },
                        token: {
                            type: 'string',
                            description: 'Token JWT para autenticação',
                            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                        },
                    },
                },
                TaskStats: {
                    type: 'object',
                    properties: {
                        total: {
                            type: 'number',
                            description: 'Total de tarefas do usuário',
                            example: 10,
                        },
                        pending: {
                            type: 'number',
                            example: 3,
                        },
                        in_progress: {
                            type: 'number',
                            example: 2,
                        },
                        completed: {
                            type: 'number',
                            example: 4,
                        },
                        cancelled: {
                            type: 'number',
                            example: 1,
                        },
                    },
                },
            },
        },
        security: [],
    },
    apis: [
        path_1.default.join(__dirname, '../routes/auth.routes.ts'),
        path_1.default.join(__dirname, '../routes/task.routes.ts'),
        path_1.default.join(__dirname, '../routes/user.routes.ts'),
    ],
};
exports.swaggerSpec = (0, swagger_jsdoc_1.default)(options);
