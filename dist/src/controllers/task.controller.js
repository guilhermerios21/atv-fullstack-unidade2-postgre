"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const task_service_1 = __importDefault(require("../services/task.service"));
const task_model_1 = require("../models/task.model");
class TaskController {
    async create(req, res) {
        try {
            const userId = req.user.id;
            const taskData = req.body;
            console.log(`[TaskController] POST /tasks - userId: ${userId}`);
            const task = await task_service_1.default.createTask(userId, taskData);
            res.status(201).json({
                message: 'Tarefa criada com sucesso',
                task
            });
        }
        catch (error) {
            console.error('[TaskController] Erro ao criar tarefa:', error.message);
            if (error.message.includes('obrigatório') || error.message.includes('caracteres')) {
                res.status(400).json({
                    message: 'Dados inválidos',
                    error: error.message
                });
                return;
            }
            res.status(500).json({
                message: 'Erro ao criar tarefa',
                error: error.message
            });
        }
    }
    async getAll(req, res) {
        try {
            const userId = req.user.id;
            console.log(`[TaskController] GET /tasks - userId: ${userId}`, req.query);
            // Construir filtros a partir de query params
            const filters = {};
            if (req.query.status && Object.values(task_model_1.TaskStatus).includes(req.query.status)) {
                filters.status = req.query.status;
            }
            if (req.query.priority && Object.values(task_model_1.TaskPriority).includes(req.query.priority)) {
                filters.priority = req.query.priority;
            }
            if (req.query.tags && typeof req.query.tags === 'string') {
                filters.tags = req.query.tags;
            }
            if (req.query.dueDateFrom && typeof req.query.dueDateFrom === 'string') {
                filters.dueDateFrom = new Date(req.query.dueDateFrom);
            }
            if (req.query.dueDateTo && typeof req.query.dueDateTo === 'string') {
                filters.dueDateTo = new Date(req.query.dueDateTo);
            }
            const tasks = await task_service_1.default.getTasks(userId, Object.keys(filters).length > 0 ? filters : undefined);
            res.status(200).json({
                message: 'Tarefas obtidas com sucesso',
                count: tasks.length,
                tasks
            });
        }
        catch (error) {
            console.error('[TaskController] Erro ao buscar tarefas:', error.message);
            res.status(500).json({
                message: 'Erro ao buscar tarefas',
                error: error.message
            });
        }
    }
    async getById(req, res) {
        try {
            const userId = req.user.id;
            const { id } = req.params;
            console.log(`[TaskController] GET /tasks/${id} - userId: ${userId}`);
            const task = await task_service_1.default.getTaskById(id, userId);
            res.status(200).json({
                message: 'Tarefa obtida com sucesso',
                task
            });
        }
        catch (error) {
            console.error('[TaskController] Erro ao buscar tarefa:', error.message);
            if (error.code === 403 || error.message === 'Acesso negado à tarefa') {
                res.status(403).json({ message: 'Acesso negado: tarefa pertence a outro usuário' });
                return;
            }
            if (error.message === 'Tarefa não encontrada') {
                res.status(404).json({
                    message: 'Tarefa não encontrada ou você não tem permissão para acessá-la'
                });
                return;
            }
            res.status(500).json({
                message: 'Erro ao buscar tarefa',
                error: error.message
            });
        }
    }
    async update(req, res) {
        try {
            const userId = req.user.id;
            const { id } = req.params;
            const updateData = req.body;
            console.log(`[TaskController] PUT /tasks/${id} - userId: ${userId}`);
            // PUT requer todos os campos obrigatórios
            if (!updateData.title || !updateData.status || !updateData.priority) {
                res.status(400).json({
                    message: 'Dados incompletos. PUT requer title, status e priority'
                });
                return;
            }
            const task = await task_service_1.default.updateTask(id, userId, updateData);
            res.status(200).json({
                message: 'Tarefa atualizada com sucesso',
                task
            });
        }
        catch (error) {
            console.error('[TaskController] Erro ao atualizar tarefa:', error.message);
            if (error.code === 403 || error.message === 'Acesso negado à tarefa') {
                res.status(403).json({ message: 'Acesso negado: tarefa pertence a outro usuário' });
                return;
            }
            if (error.message === 'Tarefa não encontrada') {
                res.status(404).json({
                    message: 'Tarefa não encontrada ou você não tem permissão para acessá-la'
                });
                return;
            }
            if (error.message.includes('não pode ser vazio') || error.message.includes('caracteres')) {
                res.status(400).json({
                    message: 'Dados inválidos',
                    error: error.message
                });
                return;
            }
            res.status(500).json({
                message: 'Erro ao atualizar tarefa',
                error: error.message
            });
        }
    }
    async partialUpdate(req, res) {
        try {
            const userId = req.user.id;
            const { id } = req.params;
            const updateData = req.body;
            console.log(`[TaskController] PATCH /tasks/${id} - userId: ${userId}`);
            if (Object.keys(updateData).length === 0) {
                res.status(400).json({
                    message: 'Nenhum campo para atualizar foi fornecido'
                });
                return;
            }
            const task = await task_service_1.default.partialUpdateTask(id, userId, updateData);
            res.status(200).json({
                message: 'Tarefa atualizada parcialmente com sucesso',
                task
            });
        }
        catch (error) {
            console.error('[TaskController] Erro ao atualizar tarefa parcialmente:', error.message);
            if (error.code === 403 || error.message === 'Acesso negado à tarefa') {
                res.status(403).json({ message: 'Acesso negado: tarefa pertence a outro usuário' });
                return;
            }
            if (error.message === 'Tarefa não encontrada') {
                res.status(404).json({
                    message: 'Tarefa não encontrada ou você não tem permissão para acessá-la'
                });
                return;
            }
            if (error.message.includes('não pode ser vazio') || error.message.includes('caracteres')) {
                res.status(400).json({
                    message: 'Dados inválidos',
                    error: error.message
                });
                return;
            }
            res.status(500).json({
                message: 'Erro ao atualizar tarefa',
                error: error.message
            });
        }
    }
    async delete(req, res) {
        try {
            const userId = req.user.id;
            const { id } = req.params;
            console.log(`[TaskController] DELETE /tasks/${id} - userId: ${userId}`);
            await task_service_1.default.deleteTask(id, userId);
            res.status(200).json({
                message: 'Tarefa deletada com sucesso'
            });
        }
        catch (error) {
            console.error('[TaskController] Erro ao deletar tarefa:', error.message);
            if (error.code === 403 || error.message === 'Acesso negado à tarefa') {
                res.status(403).json({ message: 'Acesso negado: tarefa pertence a outro usuário' });
                return;
            }
            if (error.message === 'Tarefa não encontrada') {
                res.status(404).json({
                    message: 'Tarefa não encontrada ou você não tem permissão para acessá-la'
                });
                return;
            }
            res.status(500).json({
                message: 'Erro ao deletar tarefa',
                error: error.message
            });
        }
    }
    async getStats(req, res) {
        try {
            const userId = req.user.id;
            console.log(`[TaskController] GET /tasks/stats - userId: ${userId}`);
            const stats = await task_service_1.default.getTaskStats(userId);
            res.status(200).json({
                message: 'Estatísticas obtidas com sucesso',
                stats
            });
        }
        catch (error) {
            console.error('[TaskController] Erro ao obter estatísticas:', error.message);
            res.status(500).json({
                message: 'Erro ao obter estatísticas',
                error: error.message
            });
        }
    }
}
exports.default = new TaskController();
