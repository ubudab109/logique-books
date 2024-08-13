import { DataSource } from 'typeorm';
import { Book } from '../entities/book';
import dotenv from 'dotenv';
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT ?? '5432') || 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'books',
  synchronize: true, // For development only; use migrations in production
  logging: false,
  entities: [Book],
});
