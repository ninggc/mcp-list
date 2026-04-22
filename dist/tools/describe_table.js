"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.describeTable = describeTable;
const connection_1 = require("../connection");
const validator_1 = require("../validator");
async function describeTable(table) {
    const pool = (0, connection_1.getPool)();
    if (!pool) {
        throw new Error('Not connected to MySQL');
    }
    if (!(0, validator_1.validateIdentifier)(table)) {
        throw new Error('Invalid table name');
    }
    const [rows] = await pool.query(`SHOW COLUMNS FROM \`${table}\``);
    return { columns: rows };
}
//# sourceMappingURL=describe_table.js.map