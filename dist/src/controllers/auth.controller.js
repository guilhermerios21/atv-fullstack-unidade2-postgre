"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = __importDefault(require("../services/auth.service"));
class AuthController {
    constructor() {
        this.authService = new auth_service_1.default();
    }
    async register(req, res) {
        try {
            const { name, email, password } = req.body;
            // Validações básicas
            if (!name || !email || !password) {
                res.status(422).json({ message: 'Nome, email e senha são obrigatórios' });
                return;
            }
            if (name.length < 3) {
                res.status(422).json({ message: 'Nome deve ter no mínimo 3 caracteres' });
                return;
            }
            // Validação de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                res.status(422).json({ message: 'Email inválido' });
                return;
            }
            // Validação de senha
            if (password.length < 6) {
                res.status(422).json({ message: 'Senha deve ter no mínimo 6 caracteres' });
                return;
            }
            const user = await this.authService.register({ name, email, password });
            res.status(201).json({
                message: 'Usuário criado com sucesso',
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                }
            });
        }
        catch (error) {
            const err = error;
            if (err.message.includes('duplicate key') || err.message.includes('E11000')) {
                res.status(422).json({ message: 'Email já cadastrado' });
            }
            else {
                res.status(400).json({ message: err.message || 'Erro ao registrar usuário' });
            }
        }
    }
    async login(req, res) {
        try {
            const { email, password } = req.body;
            // Validações básicas
            if (!email || !password) {
                res.status(422).json({ message: 'Email e senha são obrigatórios' });
                return;
            }
            // Validação de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                res.status(422).json({ message: 'Email inválido' });
                return;
            }
            const token = await this.authService.login(email, password);
            if (!token) {
                res.status(401).json({ message: 'Email ou senha inválidos' });
                return;
            }
            res.status(200).json({ token });
        }
        catch (error) {
            const err = error;
            res.status(401).json({ message: err.message || 'Erro ao fazer login' });
        }
    }
}
exports.AuthController = AuthController;
exports.default = AuthController;
