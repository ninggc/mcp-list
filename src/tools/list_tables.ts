import { getPool } from '../connection';
import { validateIdentifier } from '../validator';

export async function listTables(
  database?: string,
  limit: number = 50,
  offset: number = 0
): Promise<{ tables: string[] }> {
  const pool = getPool();
  if (!pool) {
    throw new Error('Not connected to MySQL');
  }

  let sql = `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = ?`;
  const params: any[] = [database || process.env.MYSQL_DATABASE || 'mysql'];

  sql += ` ORDER BY TABLE_NAME LIMIT ? OFFSET ?`;
  params.push(limit, offset);

  const [rows]: any = await pool.query(sql, params);
  const tables = rows.map((row: any) => row.TABLE_NAME);

  return { tables };
}
