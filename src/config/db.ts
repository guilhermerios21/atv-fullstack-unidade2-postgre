import prisma, { connectDB, disconnectDB } from './prisma';

export { prisma };
export { connectDB, disconnectDB };
export default connectDB;