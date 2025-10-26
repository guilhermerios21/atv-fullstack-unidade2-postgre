"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = require("body-parser");
const db_1 = __importDefault(require("../src/config/db"));
const index_1 = __importDefault(require("../src/routes/index"));
const error_middleware_1 = __importDefault(require("../src/middlewares/error.middleware"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = require("../src/config/swagger");
const app = (0, express_1.default)();
// Middleware
app.use((0, body_parser_1.json)());
// Swagger documentation
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'API Docs - JWT + Tasks CRUD',
}));
// Swagger JSON endpoint (fallback para Vercel serverless)
app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swagger_1.swaggerSpec);
});
// Health check route
app.get("/", (req, res) => {
    res.status(200).json({
        message: '✅ API de Autenticação JWT v1.0.0 - Sistema operacional!'
    });
});
// Middleware para garantir conexão com MongoDB antes de cada request
app.use(async (req, res, next) => {
    try {
        await connectToDatabase();
        next();
    }
    catch (error) {
        console.error('Database connection failed:', error);
        res.status(503).json({ message: 'Database connection unavailable' });
    }
});
// API Routes
app.use('/api', index_1.default);
// Error handling middleware
app.use(error_middleware_1.default);
// Connect to MongoDB (with error handling)
let isConnected = false;
const connectToDatabase = async () => {
    if (isConnected) {
        return;
    }
    try {
        await (0, db_1.default)();
        isConnected = true;
        console.log('MongoDB connected successfully');
    }
    catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
};
// Export for Vercel
exports.default = app;
