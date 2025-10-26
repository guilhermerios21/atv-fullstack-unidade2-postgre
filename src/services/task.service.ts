import taskRepository, { TaskFilters } from '../repositories/task.repository';
import { ITask, TaskStatus, TaskPriority } from '../models/task.model';

class TaskService {
  async createTask(userId: string, taskData: Partial<ITask>): Promise<ITask> {
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

    const task = await taskRepository.create({
      ...taskData,
      userId: userId as any,
      status: taskData.status || TaskStatus.PENDING,
      priority: taskData.priority || TaskPriority.MEDIUM
    });

  console.log(`[TaskService] Tarefa criada com sucesso: ${(task as any).id}`);
    return task;
  }

  async getTasks(userId: string, filters?: TaskFilters): Promise<ITask[]> {
    console.log(`[TaskService] Buscando tarefas para userId: ${userId}`, filters || 'sem filtros');
    
    const tasks = await taskRepository.findAll(userId, filters);
    console.log(`[TaskService] ${tasks.length} tarefa(s) encontrada(s)`);
    
    return tasks;
  }

  async getTaskById(taskId: string, userId: string): Promise<ITask> {
    console.log(`[TaskService] Buscando tarefa ${taskId} para userId: ${userId}`);
    
    const task = await taskRepository.findById(taskId, userId);
    
    if (!task) {
      // Diferenciar 404 (não existe) de 403 (não pertence ao usuário)
      const any = await taskRepository.findByIdAny(taskId);
      if (any) {
        console.error(`[TaskService] Acesso negado à tarefa ${taskId} por userId: ${userId}`);
        const err = new Error('Acesso negado à tarefa');
        (err as any).code = 403;
        throw err;
      }
      console.error(`[TaskService] Tarefa ${taskId} não encontrada`);
      throw new Error('Tarefa não encontrada');
    }

  console.log(`[TaskService] Tarefa encontrada: ${(task as any).id}`);
    return task;
  }

  async updateTask(taskId: string, userId: string, updateData: Partial<ITask>): Promise<ITask> {
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
    const { userId: _, createdAt, updatedAt, ...safeData } = updateData as any;

    const task = await taskRepository.update(taskId, userId, safeData);
    
    if (!task) {
      const any = await taskRepository.findByIdAny(taskId);
      if (any) {
        console.error(`[TaskService] Acesso negado à tarefa ${taskId} por userId: ${userId}`);
        const err = new Error('Acesso negado à tarefa');
        (err as any).code = 403;
        throw err;
      }
      console.error(`[TaskService] Tarefa ${taskId} não encontrada`);
      throw new Error('Tarefa não encontrada');
    }

  console.log(`[TaskService] Tarefa atualizada com sucesso: ${(task as any).id}`);
    return task;
  }

  async partialUpdateTask(taskId: string, userId: string, updateData: Partial<ITask>): Promise<ITask> {
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
    const { userId: _, createdAt, updatedAt, ...safeData } = updateData as any;

    const task = await taskRepository.partialUpdate(taskId, userId, safeData);
    
    if (!task) {
      const any = await taskRepository.findByIdAny(taskId);
      if (any) {
        console.error(`[TaskService] Acesso negado à tarefa ${taskId} por userId: ${userId}`);
        const err = new Error('Acesso negado à tarefa');
        (err as any).code = 403;
        throw err;
      }
      console.error(`[TaskService] Tarefa ${taskId} não encontrada`);
      throw new Error('Tarefa não encontrada');
    }

  console.log(`[TaskService] Tarefa atualizada parcialmente com sucesso: ${(task as any).id}`);
    return task;
  }

  async deleteTask(taskId: string, userId: string): Promise<void> {
    console.log(`[TaskService] Deletando tarefa ${taskId} para userId: ${userId}`);
    
    const task = await taskRepository.delete(taskId, userId);
    
    if (!task) {
      const any = await taskRepository.findByIdAny(taskId);
      if (any) {
        console.error(`[TaskService] Acesso negado à tarefa ${taskId} por userId: ${userId}`);
        const err = new Error('Acesso negado à tarefa');
        (err as any).code = 403;
        throw err;
      }
      console.error(`[TaskService] Tarefa ${taskId} não encontrada`);
      throw new Error('Tarefa não encontrada');
    }

  console.log(`[TaskService] Tarefa deletada com sucesso: ${(task as any).id}`);
  }

  async getTaskStats(userId: string): Promise<any> {
    console.log(`[TaskService] Obtendo estatísticas para userId: ${userId}`);
    
    const total = await taskRepository.countByUser(userId);
    const pending = await taskRepository.countByStatus(userId, TaskStatus.PENDING);
    const inProgress = await taskRepository.countByStatus(userId, TaskStatus.IN_PROGRESS);
    const completed = await taskRepository.countByStatus(userId, TaskStatus.COMPLETED);
    const cancelled = await taskRepository.countByStatus(userId, TaskStatus.CANCELLED);

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

export default new TaskService();
