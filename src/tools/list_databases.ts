import { getPool } from '../connection';

export async function listDatabases(
  limit: number = 50,
  offset: number = 0
): Promise<{ databases: string[] }> {
  const pool = getPool();
  if (!pool) {
    throw new Error('Not connected to MySQL');
  }

  const sql = `SHOW DATABASES LIMIT ? OFFSET ?`;
  const [rows]: any = await pool.query(sql, [limit, offset]);
  const databases = rows.map((row: any) => row.Database);

  return { databases };
}
