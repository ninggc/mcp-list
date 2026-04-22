import { getPool } from '../connection';
import { isReadOnlyMode, validateSQL } from '../validator';

export async function execute(sql: string, params?: any[]): Promise<{ affectedRows: number }> {
  if (isReadOnlyMode()) {
    throw new Error('Read-only mode: write operations are disabled');
  }

  if (!validateSQL(sql)) {
    throw new Error('SQL contains forbidden keywords');
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
