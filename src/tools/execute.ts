import { getPool, isInTransaction } from '../connection';
import { isReadOnlyMode } from '../validator';
import { QueryResult } from '../types';

export async function execute(sql: string, params?: any[]): Promise<{ affectedRows: number }> {
  if (isReadOnlyMode()) {
    throw new Error('Read-only mode: write operations are disabled');
  }

  const pool = getPool();
  if (!pool) {
    throw new Error('Not connected to MySQL');
  }

  const [result]: any = await pool.execute(sql, params);
  return {
    affectedRows: result.affectedRows || 0,
  };
}
