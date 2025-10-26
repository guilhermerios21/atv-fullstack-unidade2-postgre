"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_service_1 = __importDefault(require("../services/user.service"));
class UserController {
    constructor() {
        this.userService = new user_service_1.default();
    }
    async getAllUsers(req, res) {
        try {
            const users = await this.userService.getAllUsers();
            return res.status(200).json(users);
        }
        catch (error) {
            return res.status(500).json({ message: 'Error retrieving users', error });
        }
    }
    async getUserById(req, res) {
        const { id } = req.params;
        try {
            const user = await this.userService.getUserById(id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            return res.status(200).json(user);
        }
        catch (error) {
            return res.status(500).json({ message: 'Error retrieving user', error });
        }
    }
    async updateUser(req, res) {
        const { id } = req.params;
        const userData = req.body;
        try {
            const updatedUser = await this.userService.updateUser(id, userData);
            if (!updatedUser) {
                return res.status(404).json({ message: 'User not found' });
            }
            return res.status(200).json(updatedUser);
        }
        catch (error) {
            return res.status(500).json({ message: 'Error updating user', error });
        }
    }
    async deleteUser(req, res) {
        const { id } = req.params;
        try {
            const deletedUser = await this.userService.deleteUser(id);
            if (!deletedUser) {
                return res.status(404).json({ message: 'User not found' });
            }
            return res.status(204).send();
        }
        catch (error) {
            return res.status(500).json({ message: 'Error deleting user', error });
        }
    }
}
exports.UserController = UserController;
exports.default = UserController;
