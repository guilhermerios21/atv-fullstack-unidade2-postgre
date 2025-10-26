"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const task_controller_1 = __importDefault(require("../controllers/task.controller"));
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const router = (0, express_1.Router)();
// Todas as rotas de tasks requerem autenticação
router.use(auth_middleware_1.default);
/**
 * @swagger
 * /api/tasks/stats:
 *   get:
 *     summary: Obter estatísticas das tarefas do usuário
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estatísticas por status
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TaskStats'
 *       401:
 *         description: Não autorizado
 */
router.get('/stats', (req, res) => task_controller_1.default.getStats(req, res));
/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Criar nova tarefa
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 200
 *                 example: Estudar Node.js
 *               description:
 *                 type: string
 *                 example: Revisar Express e MongoDB
 *               status:
 *                 type: string
 *                 enum: [pending, in_progress, completed, cancelled]
 *                 default: pending
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high, urgent]
 *                 default: medium
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-10-30T23:59:59.000Z
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: [estudos, backend]
 *     responses:
 *       201:
 *         description: Tarefa criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 */
router.post('/', (req, res) => task_controller_1.default.create(req, res));
/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Listar todas as tarefas do usuário (com filtros opcionais)
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, in_progress, completed, cancelled]
 *         description: Filtrar por status
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [low, medium, high, urgent]
 *         description: Filtrar por prioridade
 *       - in: query
 *         name: tags
 *         schema:
 *           type: string
 *         description: Filtrar por tags (separadas por vírgula)
 *         example: estudos,backend
 *       - in: query
 *         name: dueDateFrom
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Data de vencimento inicial
 *       - in: query
 *         name: dueDateTo
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Data de vencimento final
 *     responses:
 *       200:
 *         description: Lista de tarefas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: number
 *                 tasks:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Task'
 *       401:
 *         description: Não autorizado
 */
router.get('/', (req, res) => task_controller_1.default.getAll(req, res));
/**
 * @swagger
 * /api/tasks/{id}:
 *   get:
 *     summary: Buscar tarefa por ID
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da tarefa
 *         example: 507f1f77bcf86cd799439022
 *     responses:
 *       200:
 *         description: Tarefa encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado (tarefa pertence a outro usuário)
 *       404:
 *         description: Tarefa não encontrada
 */
router.get('/:id', (req, res) => task_controller_1.default.getById(req, res));
/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     summary: Atualizar completamente uma tarefa
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da tarefa
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - status
 *               - priority
 *             properties:
 *               title:
 *                 type: string
 *                 example: Estudar Node.js - Atualizado
 *               description:
 *                 type: string
 *                 example: Conceitos avançados
 *               status:
 *                 type: string
 *                 enum: [pending, in_progress, completed, cancelled]
 *                 example: in_progress
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high, urgent]
 *                 example: urgent
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Tarefa atualizada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 task:
 *                   $ref: '#/components/schemas/Task'
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Tarefa não encontrada
 */
router.put('/:id', (req, res) => task_controller_1.default.update(req, res));
/**
 * @swagger
 * /api/tasks/{id}:
 *   patch:
 *     summary: Atualizar parcialmente uma tarefa
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da tarefa
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [pending, in_progress, completed, cancelled]
 *                 example: completed
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high, urgent]
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Tarefa atualizada parcialmente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 task:
 *                   $ref: '#/components/schemas/Task'
 *       400:
 *         description: Nenhum campo enviado para atualizar
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Tarefa não encontrada
 */
router.patch('/:id', (req, res) => task_controller_1.default.partialUpdate(req, res));
/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Deletar uma tarefa
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da tarefa
 *     responses:
 *       200:
 *         description: Tarefa deletada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Tarefa deletada com sucesso
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Tarefa não encontrada
 */
router.delete('/:id', (req, res) => task_controller_1.default.delete(req, res));
exports.default = router;
