"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
class UserRepository {
    constructor() { }
    async createUser(userData) {
        const created = await prisma_1.default.user.create({
            data: {
                name: userData.name,
                email: userData.email,
                password: userData.password,
            },
        });
        return created;
    }
    async findUserById(userId) {
        const user = await prisma_1.default.user.findUnique({ where: { id: userId } });
        return user;
    }
    async findUserByEmail(email) {
        // Prisma retorna todos os campos; serviços devem filtrar antes de resposta
        const user = await prisma_1.default.user.findUnique({ where: { email } });
        return user;
    }
    async updateUser(userId, updateData) {
        try {
            const updated = await prisma_1.default.user.update({
                where: { id: userId },
                data: {
                    name: updateData.name,
                    email: updateData.email,
                    // não atualizar password aqui por padrão
                },
            });
            return updated;
        }
        catch (e) {
            return null;
        }
    }
    async deleteUser(userId) {
        try {
            const deleted = await prisma_1.default.user.delete({ where: { id: userId } });
            return deleted;
        }
        catch (e) {
            return null;
        }
    }
    async getAllUsers() {
        const users = await prisma_1.default.user.findMany({ orderBy: { createdAt: 'desc' } });
        return users;
    }
}
exports.UserRepository = UserRepository;
exports.default = UserRepository;
