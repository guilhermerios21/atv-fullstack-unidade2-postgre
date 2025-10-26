"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./auth.routes"));
const user_routes_1 = __importDefault(require("./user.routes"));
const task_routes_1 = __importDefault(require("./task.routes"));
const router = (0, express_1.Router)();
// Rotas de autenticação (sem prefixo adicional)
router.use('/', auth_routes_1.default);
router.use('/users', user_routes_1.default);
router.use('/tasks', task_routes_1.default);
exports.default = router;
