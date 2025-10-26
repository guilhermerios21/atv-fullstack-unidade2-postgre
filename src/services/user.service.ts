import { prisma } from '../config/db';

export default class UserService {
  async getAllUsers() {
    return prisma.user.findMany({
      select: { id: true, name: true, email: true, createdAt: true, updatedAt: true },
    });
  }

  async getUserById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, createdAt: true, updatedAt: true },
    });
  }

  async updateUser(id: string, data: Partial<{ name: string; email: string; password: string }>) {
    try {
      return await prisma.user.update({
        where: { id },
        data,
        select: { id: true, name: true, email: true, createdAt: true, updatedAt: true },
      });
    } catch (e) {
      return null;
    }
  }

  async deleteUser(id: string) {
    try {
      return await prisma.user.delete({ where: { id } });
    } catch (e) {
      return null;
    }
  }
}
