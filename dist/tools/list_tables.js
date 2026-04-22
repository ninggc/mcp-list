"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listTables = listTables;
const connection_1 = require("../connection");
async function listTables(database, limit = 50, offset = 0) {
    const pool = (0, connection_1.getPool)();
    if (!pool) {
        throw new Error('Not connected to MySQL');
    }
    let sql = `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = ?`;
    const params = [database || process.env.MYSQL_DATABASE || 'mysql'];
    sql += ` ORDER BY TABLE_NAME LIMIT ? OFFSET ?`;
    params.push(limit, offset);
    const [rows] = await pool.query(sql, params);
    const tables = rows.map((row) => row.TABLE_NAME);
    return { tables };
}
//# sourceMappingURL=list_tables.js.map