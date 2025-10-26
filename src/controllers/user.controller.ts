import { Request, Response } from 'express';
import UserService from '../services/user.service';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async getAllUsers(_req: Request, res: Response) {
    try {
      const users = await this.userService.getAllUsers();
      return res.status(200).json(users);
    } catch (error) {
      return res.status(500).json({ message: 'Error retrieving users', error });
    }
  }

  async getUserById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const user = await this.userService.getUserById(id);
      if (!user) return res.status(404).json({ message: 'User not found' });
      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ message: 'Error retrieving user', error });
    }
  }

  async updateUser(req: Request, res: Response) {
    const { id } = req.params;
    const userData = req.body;
    try {
      const updatedUser = await this.userService.updateUser(id, userData);
      if (!updatedUser) return res.status(404).json({ message: 'User not found' });
      return res.status(200).json(updatedUser);
    } catch (error) {
      return res.status(500).json({ message: 'Error updating user', error });
    }
  }

  async deleteUser(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const deletedUser = await this.userService.deleteUser(id);
      if (!deletedUser) return res.status(404).json({ message: 'User not found' });
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ message: 'Error deleting user', error });
    }
  }
}

export default UserController;
