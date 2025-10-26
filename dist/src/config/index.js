"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    PORT: parseInt(process.env.PORT || '3000', 10),
    DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/backend_db?schema=public',
    JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret_change_in_production',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
};
exports.default = exports.config;
