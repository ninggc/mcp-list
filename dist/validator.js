"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateIdentifier = validateIdentifier;
exports.validateSQL = validateSQL;
exports.isReadOnlyMode = isReadOnlyMode;
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
function validateIdentifier(name) {
    return /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name);
}
function validateSQL(sql) {
    const upperSQL = sql.toUpperCase();
    for (const keyword of DANGEROUS_KEYWORDS) {
        if (upperSQL.includes(keyword)) {
            return false;
        }
    }
    return true;
}
function isReadOnlyMode() {
    return process.env.MYSQL_READ_ONLY === 'true';
}
//# sourceMappingURL=validator.js.map