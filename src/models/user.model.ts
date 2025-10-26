export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Este arquivo agora define apenas a interface do usuário para uso nos serviços e repositórios.
// A persistência é feita via Prisma (PostgreSQL).

export default {} as unknown as IUser;