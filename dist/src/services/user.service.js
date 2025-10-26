"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const user_repository_1 = __importDefault(require("../repositories/user.repository"));
class UserService {
    constructor() {
        this.userRepository = new user_repository_1.default();
    }
    async createUser(userData) {
        const user = await this.userRepository.createUser(userData);
        return user;
    }
    async getUserById(userId) {
        const user = await this.userRepository.findUserById(userId);
        return user;
    }
    async updateUser(userId, userData) {
        const updatedUser = await this.userRepository.updateUser(userId, userData);
        return updatedUser;
    }
    async deleteUser(userId) {
        return await this.userRepository.deleteUser(userId);
    }
    async getAllUsers() {
        const users = await this.userRepository.getAllUsers();
        return users;
    }
}
exports.UserService = UserService;
exports.default = UserService;
