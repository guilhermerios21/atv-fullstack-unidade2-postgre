"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectDB = exports.connectDB = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const connectDB = async () => {
    await prisma.$connect();
    console.log('PostgreSQL connected successfully (Prisma)');
};
exports.connectDB = connectDB;
const disconnectDB = async () => {
    await prisma.$disconnect();
    console.log('PostgreSQL disconnected successfully (Prisma)');
};
exports.disconnectDB = disconnectDB;
exports.default = prisma;
