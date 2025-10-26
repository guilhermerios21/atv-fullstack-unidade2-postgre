"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const express_1 = __importDefault(require("express"));
const body_parser_1 = require("body-parser");
const db_1 = __importDefault(require("./config/db"));
const index_1 = __importDefault(require("./routes/index"));
const error_middleware_1 = __importDefault(require("./middlewares/error.middleware"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = require("./config/swagger");
const app = (0, express_1.default)();
// Middleware
app.use((0, body_parser_1.json)());
// Swagger documentation
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'API Docs - JWT + Tasks CRUD',
}));
// Routes
app.use('/api', index_1.default);
// Error handling middleware
app.use(error_middleware_1.default);
exports.default = app;
const PORT = config_1.config.PORT || 3000;
const startServer = async () => {
    try {
        // Connect to MongoDB
        await (0, db_1.default)();
        // Start the server
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
            console.log(`📚 API Documentation available at http://localhost:${PORT}/api-docs`);
        });
    }
    catch (error) {
        console.error('Error starting server:', error);
        process.exit(1);
    }
};
app.get("/", (req, res) => {
    res.status(200).json({
        message: '✅ API de Autenticação JWT v1.0.0 - Sistema operacional!'
    });
});
startServer();
