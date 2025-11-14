import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Workflow, WorkflowExecution, Credentials } from './entities';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'database.sqlite',
  synchronize: true, // Auto-create tables (disable in production)
  logging: false,
  entities: [Workflow, WorkflowExecution, Credentials],
  migrations: [],
  subscribers: [],
});

export async function initializeDatabase(): Promise<void> {
  try {
    await AppDataSource.initialize();
    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  }
}
