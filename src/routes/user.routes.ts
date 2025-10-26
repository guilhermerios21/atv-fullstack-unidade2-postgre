import { Router, Request, Response } from 'express';
import { UserController } from '../controllers/user.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const userController = new UserController();

// Rotas relacionadas a usuários (wrappers para manter contexto 'this')
router.get('/', authMiddleware, (req: Request, res: Response) => userController.getAllUsers(req, res));
router.get('/:id', authMiddleware, (req: Request, res: Response) => userController.getUserById(req, res));
router.put('/:id', authMiddleware, (req: Request, res: Response) => userController.updateUser(req, res));
router.delete('/:id', authMiddleware, (req: Request, res: Response) => userController.deleteUser(req, res));

export default router;
