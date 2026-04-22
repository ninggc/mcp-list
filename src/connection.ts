import mysql, { Pool, PoolConnection, PoolOptions } from 'mysql2/promise';
import { MySQLConfig, MySQLPool } from './types';

let pool: MySQLPool | null = null;
let connection: PoolConnection | null = null;
let inTransaction = false;

export function createPool(config: MySQLConfig): Pool {
  const poolConfig: PoolOptions = {
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    database: config.database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  };

  pool = mysql.createPool(poolConfig);
  return pool as unknown as Pool;
}

export function getPool(): MySQLPool | null {
  return pool;
}

export function getConnection(): Promise<PoolConnection> {
  if (!pool) {
    throw new Error('Pool not initialized. Call connect first.');
  }
  return pool.getConnection();
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  retryDelay: number = 1000
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxRetries - 1) {
        const delay = retryDelay * Math.pow(2, attempt);
        await sleep(delay);
      }
    }
  }

  throw lastError || new Error('Max retries exceeded');
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function beginTransaction(): Promise<void> {
  if (inTransaction) {
    throw new Error('Transaction already in progress');
  }
  if (!pool) {
    throw new Error('Pool not initialized');
  }
  const conn = await pool.getConnection();
  await conn.beginTransaction();
  connection = conn;
  inTransaction = true;
}

export async function commit(): Promise<void> {
  if (!connection || !inTransaction) {
    throw new Error('No active transaction');
  }
  await connection.commit();
  connection.release();
  connection = null;
  inTransaction = false;
}

export async function rollback(): Promise<void> {
  if (!connection || !inTransaction) {
    throw new Error('No active transaction');
  }
  await connection.rollback();
  connection.release();
  connection = null;
  inTransaction = false;
}

export function isInTransaction(): boolean {
  return inTransaction;
}

export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
  if (connection) {
    connection.release();
    connection = null;
  }
  inTransaction = false;
}
