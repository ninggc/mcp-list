import { Pool, PoolConnection } from 'mysql2/promise';
import { MySQLConfig, MySQLPool } from './types';
export declare function createPool(config: MySQLConfig): Pool;
export declare function getPool(): MySQLPool | null;
export declare function getConnection(): Promise<PoolConnection>;
export declare function withRetry<T>(fn: () => Promise<T>, maxRetries?: number, retryDelay?: number): Promise<T>;
export declare function beginTransaction(): Promise<void>;
export declare function commit(): Promise<void>;
export declare function rollback(): Promise<void>;
export declare function isInTransaction(): boolean;
export declare function closePool(): Promise<void>;
//# sourceMappingURL=connection.d.ts.map