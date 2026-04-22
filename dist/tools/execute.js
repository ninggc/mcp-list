"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = execute;
const connection_1 = require("../connection");
const validator_1 = require("../validator");
async function execute(sql, params) {
    if ((0, validator_1.isReadOnlyMode)()) {
        throw new Error('Read-only mode: write operations are disabled');
    }
    const pool = (0, connection_1.getPool)();
    if (!pool) {
        throw new Error('Not connected to MySQL');
    }
    const [result] = await pool.execute(sql, params);
    return {
        affectedRows: result.affectedRows || 0,
    };
}
//# sourceMappingURL=execute.js.map