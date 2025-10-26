"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const task_repository_1 = __importDefault(require("../repositories/task.repository"));
const task_model_1 = require("../models/task.model");
class TaskService {
    async createTask(userId, taskData) {
        console.log(`[TaskService] Criando tarefa para userId: ${userId}`);
        // Validações de negócio
        if (!taskData.title || taskData.title.trim().length === 0) {
            console.error('[TaskService] Erro: título vazio');
            throw new Error('Título é obrigatório');
        }
        if (taskData.title.trim().length < 3) {
            console.error('[TaskService] Erro: título muito curto');
            throw new Error('Título deve ter no mínimo 3 caracteres');
        }
        if (taskData.dueDate && new Date(taskData.dueDate) < new Date()) {
            console.warn('[TaskService] Aviso: data de vencimento no passado');
        }
        const task = await task_repository_1.default.create({
            ...taskData,
            userId: userId,
            status: taskData.status || task_model_1.TaskStatus.PENDING,
            priority: taskData.priority || task_model_1.TaskPriority.MEDIUM
        });
        console.log(`[TaskService] Tarefa criada com sucesso: ${task.id}`);
        return task;
    }
    async getTasks(userId, filters) {
        console.log(`[TaskService] Buscando tarefas para userId: ${userId}`, filters || 'sem filtros');
        const tasks = await task_repository_1.default.findAll(userId, filters);
        console.log(`[TaskService] ${tasks.length} tarefa(s) encontrada(s)`);
        return tasks;
    }
    async getTaskById(taskId, userId) {
        console.log(`[TaskService] Buscando tarefa ${taskId} para userId: ${userId}`);
        const task = await task_repository_1.default.findById(taskId, userId);
        if (!task) {
            // Diferenciar 404 (não existe) de 403 (não pertence ao usuário)
            const any = await task_repository_1.default.findByIdAny(taskId);
            if (any) {
                console.error(`[TaskService] Acesso negado à tarefa ${taskId} por userId: ${userId}`);
                const err = new Error('Acesso negado à tarefa');
                err.code = 403;
                throw err;
            }
            console.error(`[TaskService] Tarefa ${taskId} não encontrada`);
            throw new Error('Tarefa não encontrada');
        }
        console.log(`[TaskService] Tarefa encontrada: ${task.id}`);
        return task;
    }
    async updateTask(taskId, userId, updateData) {
        console.log(`[TaskService] Atualizando tarefa ${taskId} para userId: ${userId}`);
        // Validações
        if (updateData.title !== undefined) {
            if (!updateData.title || updateData.title.trim().length === 0) {
                throw new Error('Título não pode ser vazio');
            }
            if (updateData.title.trim().length < 3) {
                throw new Error('Título deve ter no mínimo 3 caracteres');
            }
        }
        if (updateData.dueDate && new Date(updateData.dueDate) < new Date()) {
            console.warn('[TaskService] Aviso: data de vencimento no passado');
        }
        // Remove campos que não devem ser atualizados
        const { userId: _, createdAt, updatedAt, ...safeData } = updateData;
        const task = await task_repository_1.default.update(taskId, userId, safeData);
        if (!task) {
            const any = await task_repository_1.default.findByIdAny(taskId);
            if (any) {
                console.error(`[TaskService] Acesso negado à tarefa ${taskId} por userId: ${userId}`);
                const err = new Error('Acesso negado à tarefa');
                err.code = 403;
                throw err;
            }
            console.error(`[TaskService] Tarefa ${taskId} não encontrada`);
            throw new Error('Tarefa não encontrada');
        }
        console.log(`[TaskService] Tarefa atualizada com sucesso: ${task.id}`);
        return task;
    }
    async partialUpdateTask(taskId, userId, updateData) {
        console.log(`[TaskService] Atualizando parcialmente tarefa ${taskId} para userId: ${userId}`);
        // Validações apenas para campos presentes
        if (updateData.title !== undefined) {
            if (!updateData.title || updateData.title.trim().length === 0) {
                throw new Error('Título não pode ser vazio');
            }
            if (updateData.title.trim().length < 3) {
                throw new Error('Título deve ter no mínimo 3 caracteres');
            }
        }
        if (updateData.dueDate && new Date(updateData.dueDate) < new Date()) {
            console.warn('[TaskService] Aviso: data de vencimento no passado');
        }
        // Remove campos que não devem ser atualizados
        const { userId: _, createdAt, updatedAt, ...safeData } = updateData;
        const task = await task_repository_1.default.partialUpdate(taskId, userId, safeData);
        if (!task) {
            const any = await task_repository_1.default.findByIdAny(taskId);
            if (any) {
                console.error(`[TaskService] Acesso negado à tarefa ${taskId} por userId: ${userId}`);
                const err = new Error('Acesso negado à tarefa');
                err.code = 403;
                throw err;
            }
            console.error(`[TaskService] Tarefa ${taskId} não encontrada`);
            throw new Error('Tarefa não encontrada');
        }
        console.log(`[TaskService] Tarefa atualizada parcialmente com sucesso: ${task.id}`);
        return task;
    }
    async deleteTask(taskId, userId) {
        console.log(`[TaskService] Deletando tarefa ${taskId} para userId: ${userId}`);
        const task = await task_repository_1.default.delete(taskId, userId);
        if (!task) {
            const any = await task_repository_1.default.findByIdAny(taskId);
            if (any) {
                console.error(`[TaskService] Acesso negado à tarefa ${taskId} por userId: ${userId}`);
                const err = new Error('Acesso negado à tarefa');
                err.code = 403;
                throw err;
            }
            console.error(`[TaskService] Tarefa ${taskId} não encontrada`);
            throw new Error('Tarefa não encontrada');
        }
        console.log(`[TaskService] Tarefa deletada com sucesso: ${task.id}`);
    }
    async getTaskStats(userId) {
        console.log(`[TaskService] Obtendo estatísticas para userId: ${userId}`);
        const total = await task_repository_1.default.countByUser(userId);
        const pending = await task_repository_1.default.countByStatus(userId, task_model_1.TaskStatus.PENDING);
        const inProgress = await task_repository_1.default.countByStatus(userId, task_model_1.TaskStatus.IN_PROGRESS);
        const completed = await task_repository_1.default.countByStatus(userId, task_model_1.TaskStatus.COMPLETED);
        const cancelled = await task_repository_1.default.countByStatus(userId, task_model_1.TaskStatus.CANCELLED);
        const stats = {
            total,
            byStatus: {
                pending,
                inProgress,
                completed,
                cancelled
            }
        };
        console.log(`[TaskService] Estatísticas obtidas:`, stats);
        return stats;
    }
}
exports.default = new TaskService();
