import * as dotenv from 'dotenv';

dotenv.config();

export const config = {
  PORT: parseInt(process.env.PORT || '3000', 10),
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/backend_db?schema=public',
  JWT_SECRET: process.env.JWT_SECRET || 'e8f9c2d7a4b1f6e3d8c5a2b7f4e1d8c5a2b7f4e1d8c5a2b7f4e1d8c5',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
};

export default config;