import { getPool, isInTransaction } from '../connection';
import { QueryResult } from '../types';

export async function query(sql: string, params?: any[]): Promise<QueryResult> {
  const pool = getPool();
  if (!pool) {
    throw new Error('Not connected to MySQL');
  }

  const [rows]: any = await pool.query(sql, params);
  const columns = rows.length > 0 ? Object.keys(rows[0]) : [];

  return {
    columns,
    rows: rows as Record<string, any>[],
    rowCount: rows.length,
  };
}
