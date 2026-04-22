const DANGEROUS_KEYWORDS = [
  'DROP',
  'DELETE',
  'TRUNCATE',
  'ALTER',
  'CREATE',
  'GRANT',
  'REVOKE',
  'SHUTDOWN',
  'LOAD',
  'OUTFILE',
  'INFILE',
];

export function validateIdentifier(name: string): boolean {
  return /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name);
}

export function validateSQL(sql: string): boolean {
  const upperSQL = sql.toUpperCase();
  for (const keyword of DANGEROUS_KEYWORDS) {
    if (upperSQL.includes(keyword)) {
      return false;
    }
  }
  return true;
}

export function isReadOnlyMode(): boolean {
  return process.env.MYSQL_READ_ONLY === 'true';
}
