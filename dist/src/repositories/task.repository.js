"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const task_model_1 = require("../models/task.model");
const prisma_1 = __importDefault(require("../config/prisma"));
class TaskRepository {
    async create(taskData) {
        const task = await prisma_1.default.task.create({
            data: {
                userId: taskData.userId,
                title: taskData.title,
                description: taskData.description,
                status: taskData.status ?? task_model_1.TaskStatus.PENDING,
                priority: taskData.priority ?? task_model_1.TaskPriority.MEDIUM,
                dueDate: taskData.dueDate ? new Date(taskData.dueDate) : undefined,
                tags: taskData.tags || [],
            },
        });
        return task;
    }
    async findAll(userId, filters) {
        const where = { userId };
        if (filters?.status)
            where.status = filters.status;
        if (filters?.priority)
            where.priority = filters.priority;
        if (filters?.tags) {
            const tagsArray = filters.tags.split(',').map(t => t.trim());
            // Contém pelo menos uma das tags
            where.tags = { hasSome: tagsArray };
        }
        if (filters?.dueDateFrom || filters?.dueDateTo) {
            where.dueDate = {};
            if (filters.dueDateFrom)
                where.dueDate.gte = filters.dueDateFrom;
            if (filters.dueDateTo)
                where.dueDate.lte = filters.dueDateTo;
        }
        const tasks = await prisma_1.default.task.findMany({ where, orderBy: { createdAt: 'desc' } });
        return tasks;
    }
    async findById(taskId, userId) {
        const task = await prisma_1.default.task.findFirst({ where: { id: taskId, userId } });
        return task;
    }
    // Busca por ID sem filtrar por usuário (para distinguir 404 de 403)
    async findByIdAny(taskId) {
        const task = await prisma_1.default.task.findUnique({ where: { id: taskId } });
        return task;
    }
    async update(taskId, userId, updateData) {
        try {
            const updated = await prisma_1.default.task.update({
                where: { id: taskId },
                data: {
                    title: updateData.title,
                    description: updateData.description,
                    status: updateData.status,
                    priority: updateData.priority,
                    dueDate: updateData.dueDate ? new Date(updateData.dueDate) : undefined,
                    tags: updateData.tags,
                },
            });
            // garantir proprietário
            if (updated.userId !== userId)
                return null;
            return updated;
        }
        catch (e) {
            return null;
        }
    }
    async partialUpdate(taskId, userId, updateData) {
        try {
            const updated = await prisma_1.default.task.update({
                where: { id: taskId },
                data: {
                    ...(updateData.title !== undefined ? { title: updateData.title } : {}),
                    ...(updateData.description !== undefined ? { description: updateData.description } : {}),
                    ...(updateData.status !== undefined ? { status: updateData.status } : {}),
                    ...(updateData.priority !== undefined ? { priority: updateData.priority } : {}),
                    ...(updateData.dueDate !== undefined ? { dueDate: updateData.dueDate ? new Date(updateData.dueDate) : null } : {}),
                    ...(updateData.tags !== undefined ? { tags: updateData.tags } : {}),
                },
            });
            if (updated.userId !== userId)
                return null;
            return updated;
        }
        catch (e) {
            return null;
        }
    }
    async delete(taskId, userId) {
        try {
            const task = await prisma_1.default.task.findUnique({ where: { id: taskId } });
            if (!task)
                return null;
            if (task.userId !== userId)
                return null;
            const deleted = await prisma_1.default.task.delete({ where: { id: taskId } });
            return deleted;
        }
        catch (e) {
            return null;
        }
    }
    async countByUser(userId) {
        return await prisma_1.default.task.count({ where: { userId } });
    }
    async countByStatus(userId, status) {
        return await prisma_1.default.task.count({ where: { userId, status: status } });
    }
}
exports.default = new TaskRepository();
