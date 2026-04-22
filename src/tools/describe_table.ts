import { getPool } from '../connection';
import { validateIdentifier } from '../validator';

export async function describeTable(table: string): Promise<{
  columns: Array<{
    Field: string;
    Type: string;
    Null: string;
    Key: string;
    Default: any;
    Extra: string;
  }>;
}> {
  const pool = getPool();
  if (!pool) {
    throw new Error('Not connected to MySQL');
  }

  if (!validateIdentifier(table)) {
    throw new Error('Invalid table name');
  }

  const [rows]: any = await pool.query(`SHOW COLUMNS FROM \`${table}\``);
  return { columns: rows };
}
