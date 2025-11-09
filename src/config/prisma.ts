import { PrismaClient } from '@prisma/client';

// Singleton para reutilizar conexão em ambiente serverless
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient({
  log: ['error', 'warn'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export const connectDB = async () => {
  // Em serverless, Prisma conecta automaticamente no primeiro uso
  // Não precisa de $connect() explícito
  console.log('Prisma client ready');
};

export const disconnectDB = async () => {
  await prisma.$disconnect();
  console.log('PostgreSQL disconnected successfully (Prisma)');
};

export default prisma;
