"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPool = createPool;
exports.getPool = getPool;
exports.getConnection = getConnection;
exports.withRetry = withRetry;
exports.beginTransaction = beginTransaction;
exports.commit = commit;
exports.rollback = rollback;
exports.isInTransaction = isInTransaction;
exports.closePool = closePool;
const promise_1 = __importDefault(require("mysql2/promise"));
let pool = null;
let connection = null;
let inTransaction = false;
function createPool(config) {
    const poolConfig = {
        host: config.host,
        port: config.port,
        user: config.user,
        password: config.password,
        database: config.database,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
    };
    pool = promise_1.default.createPool(poolConfig);
    return pool;
}
function getPool() {
    return pool;
}
function getConnection() {
    if (!pool) {
        throw new Error('Pool not initialized. Call connect first.');
    }
    return pool.getConnection();
}
async function withRetry(fn, maxRetries = 3, retryDelay = 1000) {
    let lastError;
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            return await fn();
        }
        catch (error) {
            lastError = error;
            if (attempt < maxRetries - 1) {
                const delay = retryDelay * Math.pow(2, attempt);
                await sleep(delay);
            }
        }
    }
    throw lastError || new Error('Max retries exceeded');
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function beginTransaction() {
    if (inTransaction) {
        throw new Error('Transaction already in progress');
    }
    if (!pool) {
        throw new Error('Pool not initialized');
    }
    const conn = await pool.getConnection();
    await conn.beginTransaction();
    connection = conn;
    inTransaction = true;
}
async function commit() {
    if (!connection || !inTransaction) {
        throw new Error('No active transaction');
    }
    await connection.commit();
    connection.release();
    connection = null;
    inTransaction = false;
}
async function rollback() {
    if (!connection || !inTransaction) {
        throw new Error('No active transaction');
    }
    await connection.rollback();
    connection.release();
    connection = null;
    inTransaction = false;
}
function isInTransaction() {
    return inTransaction;
}
async function closePool() {
    if (pool) {
        await pool.end();
        pool = null;
    }
    if (connection) {
        connection.release();
        connection = null;
    }
    inTransaction = false;
}
//# sourceMappingURL=connection.js.map