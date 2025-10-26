import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import taskRoutes from './task.routes';

const router = Router();

// Rotas de autenticação (sem prefixo adicional)
router.use('/', authRoutes);
router.use('/users', userRoutes);
router.use('/tasks', taskRoutes);

export default router;
