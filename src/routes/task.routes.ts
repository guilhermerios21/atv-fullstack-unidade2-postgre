import { Router, Request, Response } from 'express';
import taskController from '../controllers/task.controller';
import authMiddleware from '../middlewares/auth.middleware';

const router = Router();

// Todas as rotas de tasks requerem autenticação
router.use(authMiddleware);

router.get('/stats', (req: Request, res: Response) => taskController.getStats(req, res));
router.post('/', (req: Request, res: Response) => taskController.create(req, res));
router.get('/', (req: Request, res: Response) => taskController.getAll(req, res));
router.get('/:id', (req: Request, res: Response) => taskController.getById(req, res));
router.put('/:id', (req: Request, res: Response) => taskController.update(req, res));
router.patch('/:id', (req: Request, res: Response) => taskController.partialUpdate(req, res));
router.delete('/:id', (req: Request, res: Response) => taskController.delete(req, res));

export default router;
