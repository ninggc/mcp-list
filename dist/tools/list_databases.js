"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listDatabases = listDatabases;
const connection_1 = require("../connection");
async function listDatabases(limit = 50, offset = 0) {
    const pool = (0, connection_1.getPool)();
    if (!pool) {
        throw new Error('Not connected to MySQL');
    }
    const sql = `SHOW DATABASES LIMIT ? OFFSET ?`;
    const [rows] = await pool.query(sql, [limit, offset]);
    const databases = rows.map((row) => row.Database);
    return { databases };
}
//# sourceMappingURL=list_databases.js.map