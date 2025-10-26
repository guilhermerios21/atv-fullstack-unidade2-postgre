import { ITask, TaskStatus, TaskPriority } from '../models/task.model';
import prisma from '../config/prisma';

export interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  tags?: string;
  dueDateFrom?: Date;
  dueDateTo?: Date;
}

class TaskRepository {
  async create(taskData: Partial<ITask>): Promise<ITask> {
    const task = await prisma.task.create({
      data: {
        userId: taskData.userId as string,
        title: taskData.title!,
        description: taskData.description,
        status: (taskData.status as any) ?? TaskStatus.PENDING,
        priority: (taskData.priority as any) ?? TaskPriority.MEDIUM,
        dueDate: taskData.dueDate ? new Date(taskData.dueDate) : undefined,
        tags: taskData.tags || [],
      },
    });
    return task as unknown as ITask;
  }

  async findAll(userId: string, filters?: TaskFilters): Promise<ITask[]> {
    const where: any = { userId };
    if (filters?.status) where.status = filters.status;
    if (filters?.priority) where.priority = filters.priority;
    if (filters?.tags) {
      const tagsArray = filters.tags.split(',').map(t => t.trim());
      // Contém pelo menos uma das tags
      where.tags = { hasSome: tagsArray };
    }
    if (filters?.dueDateFrom || filters?.dueDateTo) {
      where.dueDate = {};
      if (filters.dueDateFrom) where.dueDate.gte = filters.dueDateFrom;
      if (filters.dueDateTo) where.dueDate.lte = filters.dueDateTo;
    }

    const tasks = await prisma.task.findMany({ where, orderBy: { createdAt: 'desc' } });
    return tasks as unknown as ITask[];
  }

  async findById(taskId: string, userId: string): Promise<ITask | null> {
    const task = await prisma.task.findFirst({ where: { id: taskId, userId } });
    return task as unknown as ITask | null;
  }

  // Busca por ID sem filtrar por usuário (para distinguir 404 de 403)
  async findByIdAny(taskId: string): Promise<ITask | null> {
    const task = await prisma.task.findUnique({ where: { id: taskId } });
    return task as unknown as ITask | null;
  }

  async update(taskId: string, userId: string, updateData: Partial<ITask>): Promise<ITask | null> {
    try {
      const updated = await prisma.task.update({
        where: { id: taskId },
        data: {
          title: updateData.title,
          description: updateData.description,
          status: updateData.status as any,
          priority: updateData.priority as any,
          dueDate: updateData.dueDate ? new Date(updateData.dueDate) : undefined,
          tags: updateData.tags,
        },
      });
      // garantir proprietário
      if (updated.userId !== userId) return null;
      return updated as unknown as ITask;
    } catch (e) {
      return null;
    }
  }

  async partialUpdate(taskId: string, userId: string, updateData: Partial<ITask>): Promise<ITask | null> {
    try {
      const updated = await prisma.task.update({
        where: { id: taskId },
        data: {
          ...(updateData.title !== undefined ? { title: updateData.title } : {}),
          ...(updateData.description !== undefined ? { description: updateData.description } : {}),
          ...(updateData.status !== undefined ? { status: updateData.status as any } : {}),
          ...(updateData.priority !== undefined ? { priority: updateData.priority as any } : {}),
          ...(updateData.dueDate !== undefined ? { dueDate: updateData.dueDate ? new Date(updateData.dueDate) : null } : {}),
          ...(updateData.tags !== undefined ? { tags: updateData.tags } : {}),
        },
      });
      if (updated.userId !== userId) return null;
      return updated as unknown as ITask;
    } catch (e) {
      return null;
    }
  }

  async delete(taskId: string, userId: string): Promise<ITask | null> {
    try {
      const task = await prisma.task.findUnique({ where: { id: taskId } });
      if (!task) return null;
      if (task.userId !== userId) return null;
      const deleted = await prisma.task.delete({ where: { id: taskId } });
      return deleted as unknown as ITask;
    } catch (e) {
      return null;
    }
  }

  async countByUser(userId: string): Promise<number> {
    return await prisma.task.count({ where: { userId } });
  }

  async countByStatus(userId: string, status: TaskStatus): Promise<number> {
    return await prisma.task.count({ where: { userId, status: status as any } });
  }
}

export default new TaskRepository();
