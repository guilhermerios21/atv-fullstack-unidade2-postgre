"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';
const EXPIRATION_TIME = '1h'; // Token expiration time
const generateToken = (userId) => {
    return jsonwebtoken_1.default.sign({ id: userId }, SECRET_KEY, { expiresIn: EXPIRATION_TIME });
};
exports.generateToken = generateToken;
const verifyToken = (token) => {
    try {
        return jsonwebtoken_1.default.verify(token, SECRET_KEY);
    }
    catch (error) {
        return null;
    }
};
exports.verifyToken = verifyToken;
