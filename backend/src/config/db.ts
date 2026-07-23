import { Pool } from 'pg';
import { env } from './env';

// Use connectionString if DATABASE_URL is set (e.g. Render PostgreSQL), otherwise use individual params
const poolConfig = env.DATABASE_URL
  ? {
      connectionString: env.DATABASE_URL,
      // Render PostgreSQL requires SSL mode for external connections
      ssl: env.DATABASE_URL.includes('render.com') || process.env.DB_SSL === 'true'
        ? { rejectUnauthorized: false }
        : false,
    }
  : {
      host: env.DB_HOST,
      port: env.DB_PORT,
      database: env.DB_NAME,
      user: env.DB_USER,
      password: env.DB_PASSWORD,
    };

export const pool = new Pool(poolConfig);

pool.on('error', (err) => {
  console.error('Unexpected error on idle database client', err);
});
