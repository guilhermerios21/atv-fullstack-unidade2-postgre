"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
const authController = new auth_controller_1.AuthController();
/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Cadastrar novo usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: João Silva
 *               email:
 *                 type: string
 *                 format: email
 *                 example: joao.silva@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 example: senha123
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Usuário criado com sucesso
 *       400:
 *         description: Dados inválidos ou email já existe
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       422:
 *         description: Validação falhou
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/register', (req, res) => authController.register(req, res));
/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Autenticar usuário e obter token JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: joao.silva@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: senha123
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       401:
 *         description: Credenciais inválidas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       422:
 *         description: Validação falhou
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/login', (req, res) => authController.login(req, res));
/**
 * @swagger
 * /api/protected:
 *   get:
 *     summary: Rota protegida de exemplo (requer autenticação)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Acesso autorizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Rota protegida acessada com sucesso
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *       401:
 *         description: Token ausente ou inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/protected', auth_middleware_1.authMiddleware, (req, res) => {
    res.status(200).json({
        message: 'Rota protegida acessada com sucesso',
        user: req.user,
    });
});
exports.default = router;
