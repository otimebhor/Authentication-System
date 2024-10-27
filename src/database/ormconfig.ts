import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

config();

export const databaseOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: +process.env.DATABASE_PORT,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: ['dist/src/**/*.entity.js'],
  migrations: ['src/database/migrations/*.ts'],
  subscribers: [],
  migrationsTableName: 'authentication_migration_table',
  ssl:
    process.env.POSTGRES_SSL === 'true' ? { rejectUnauthorized: false } : false,
};

const dataSource = new DataSource(databaseOptions);

export default dataSource;
