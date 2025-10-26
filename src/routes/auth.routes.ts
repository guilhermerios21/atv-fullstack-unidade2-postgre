import { Router, Request, Response } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const authController = new AuthController();

/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Cadastrar novo usuário
 *     tags: [Auth]
 */
router.post('/register', (req: Request, res: Response) => authController.register(req, res));

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Autenticar usuário e obter token JWT
 *     tags: [Auth]
 */
router.post('/login', (req: Request, res: Response) => authController.login(req, res));

/**
 * @swagger
 * /api/protected:
 *   get:
 *     summary: Rota protegida de exemplo (requer autenticação)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 */
router.get('/protected', authMiddleware, (req: any, res: Response) => {
  res.status(200).json({ message: 'Rota protegida acessada com sucesso', user: req.user });
});

export default router;
