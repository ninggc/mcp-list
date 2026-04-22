"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.begin_transaction = begin_transaction;
exports.commit = commit;
exports.rollback = rollback;
const connection_1 = require("../connection");
async function begin_transaction() {
    try {
        await (0, connection_1.beginTransaction)();
        return { success: true, message: 'Transaction started' };
    }
    catch (error) {
        throw new Error(`Failed to begin transaction: ${error}`);
    }
}
async function commit() {
    try {
        await (0, connection_1.commit)();
        return { success: true, message: 'Transaction committed' };
    }
    catch (error) {
        throw new Error(`Failed to commit: ${error}`);
    }
}
async function rollback() {
    try {
        await (0, connection_1.rollback)();
        return { success: true, message: 'Transaction rolled back' };
    }
    catch (error) {
        throw new Error(`Failed to rollback: ${error}`);
    }
}
//# sourceMappingURL=transaction.js.map