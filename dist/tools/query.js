"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.query = query;
const connection_1 = require("../connection");
async function query(sql, params) {
    const pool = (0, connection_1.getPool)();
    if (!pool) {
        throw new Error('Not connected to MySQL');
    }
    const [rows] = await pool.query(sql, params);
    const columns = rows.length > 0 ? Object.keys(rows[0]) : [];
    return {
        columns,
        rows: rows,
        rowCount: rows.length,
    };
}
//# sourceMappingURL=query.js.map