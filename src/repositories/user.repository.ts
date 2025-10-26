import { IUser } from '../models/user.model';
import prisma from '../config/prisma';

export class UserRepository {
    constructor() {}

    async createUser(userData: Partial<IUser>): Promise<IUser> {
        const created = await prisma.user.create({
            data: {
                name: userData.name!,
                email: userData.email!,
                password: userData.password!,
            },
        });
        return created as unknown as IUser;
    }

    async findUserById(userId: string): Promise<IUser | null> {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        return user as unknown as IUser | null;
    }

    async findUserByEmail(email: string): Promise<IUser | null> {
        // Prisma retorna todos os campos; serviços devem filtrar antes de resposta
        const user = await prisma.user.findUnique({ where: { email } });
        return user as unknown as IUser | null;
    }

    async updateUser(userId: string, updateData: Partial<IUser>): Promise<IUser | null> {
        try {
            const updated = await prisma.user.update({
                where: { id: userId },
                data: {
                    name: updateData.name,
                    email: updateData.email,
                    // não atualizar password aqui por padrão
                },
            });
            return updated as unknown as IUser;
        } catch (e) {
            return null;
        }
    }

    async deleteUser(userId: string): Promise<IUser | null> {
        try {
            const deleted = await prisma.user.delete({ where: { id: userId } });
            return deleted as unknown as IUser;
        } catch (e) {
            return null;
        }
    }

    async getAllUsers(): Promise<IUser[]> {
        const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
        return users as unknown as IUser[];
    }
}

export default UserRepository;