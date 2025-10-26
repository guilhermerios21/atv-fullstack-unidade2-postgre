import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const connectDB = async () => {
  await prisma.$connect();
  console.log('PostgreSQL connected successfully (Prisma)');
};

export const disconnectDB = async () => {
  await prisma.$disconnect();
  console.log('PostgreSQL disconnected successfully (Prisma)');
};

export default prisma;
