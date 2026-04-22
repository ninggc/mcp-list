"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("@modelcontextprotocol/sdk/server/index.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const types_js_1 = require("@modelcontextprotocol/sdk/types.js");
const query_1 = require("./tools/query");
const execute_1 = require("./tools/execute");
const list_tables_1 = require("./tools/list_tables");
const describe_table_1 = require("./tools/describe_table");
const list_databases_1 = require("./tools/list_databases");
const connect_1 = require("./tools/connect");
const disconnect_1 = require("./tools/disconnect");
const transaction_1 = require("./tools/transaction");
const server = new index_js_1.Server({
    name: 'mysql-mcp',
    version: '1.0.0',
}, {
    capabilities: {
        tools: {},
    },
});
server.setRequestHandler(types_js_1.ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: 'query',
                description: 'Execute a parameterized SELECT query and return the result set',
                inputSchema: {
                    type: 'object',
                    properties: {
                        sql: { type: 'string', description: 'SQL query string' },
                        params: {
                            type: 'array',
                            description: 'Query parameters for parameterized queries',
                            items: { type: 'any' },
                        },
                    },
                    required: ['sql'],
                },
            },
            {
                name: 'execute',
                description: 'Execute a parameterized write operation (INSERT, UPDATE, DELETE)',
                inputSchema: {
                    type: 'object',
                    properties: {
                        sql: { type: 'string', description: 'SQL statement' },
                        params: {
                            type: 'array',
                            description: 'Parameters for parameterized statements',
                            items: { type: 'any' },
                        },
                    },
                    required: ['sql'],
                },
            },
            {
                name: 'list_tables',
                description: 'List tables in a database with pagination',
                inputSchema: {
                    type: 'object',
                    properties: {
                        database: { type: 'string', description: 'Database name' },
                        limit: { type: 'number', description: 'Maximum number of results', default: 50 },
                        offset: { type: 'number', description: 'Number of results to skip', default: 0 },
                    },
                },
            },
            {
                name: 'describe_table',
                description: 'Show columns of a table',
                inputSchema: {
                    type: 'object',
                    properties: {
                        table: { type: 'string', description: 'Table name' },
                    },
                    required: ['table'],
                },
            },
            {
                name: 'list_databases',
                description: 'List databases with pagination',
                inputSchema: {
                    type: 'object',
                    properties: {
                        limit: { type: 'number', description: 'Maximum number of results', default: 50 },
                        offset: { type: 'number', description: 'Number of results to skip', default: 0 },
                    },
                },
            },
            {
                name: 'connect',
                description: 'Establish a connection pool to MySQL',
                inputSchema: {
                    type: 'object',
                    properties: {
                        host: { type: 'string', description: 'MySQL host' },
                        port: { type: 'number', description: 'MySQL port' },
                        user: { type: 'string', description: 'Database user' },
                        password: { type: 'string', description: 'Database password' },
                        database: { type: 'string', description: 'Default database' },
                        readOnly: { type: 'boolean', description: 'Enable read-only mode' },
                        maxRetries: { type: 'number', description: 'Maximum retry attempts', default: 3 },
                        retryDelay: { type: 'number', description: 'Retry delay in ms', default: 1000 },
                    },
                    required: ['host', 'port', 'user', 'password'],
                },
            },
            {
                name: 'disconnect',
                description: 'Close the MySQL connection pool',
                inputSchema: {
                    type: 'object',
                    properties: {},
                },
            },
            {
                name: 'begin_transaction',
                description: 'Start a new transaction',
                inputSchema: {
                    type: 'object',
                    properties: {},
                },
            },
            {
                name: 'commit',
                description: 'Commit the current transaction',
                inputSchema: {
                    type: 'object',
                    properties: {},
                },
            },
            {
                name: 'rollback',
                description: 'Roll back the current transaction',
                inputSchema: {
                    type: 'object',
                    properties: {},
                },
            },
        ],
    };
});
server.setRequestHandler(types_js_1.CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    const params = args || {};
    try {
        switch (name) {
            case 'query': {
                const result = await (0, query_1.query)(params.sql, params.params);
                return { content: [{ type: 'text', text: JSON.stringify(result) }] };
            }
            case 'execute': {
                const result = await (0, execute_1.execute)(params.sql, params.params);
                return { content: [{ type: 'text', text: JSON.stringify(result) }] };
            }
            case 'list_tables': {
                const result = await (0, list_tables_1.listTables)(params.database, params.limit, params.offset);
                return { content: [{ type: 'text', text: JSON.stringify(result) }] };
            }
            case 'describe_table': {
                const result = await (0, describe_table_1.describeTable)(params.table);
                return { content: [{ type: 'text', text: JSON.stringify(result) }] };
            }
            case 'list_databases': {
                const result = await (0, list_databases_1.listDatabases)(params.limit, params.offset);
                return { content: [{ type: 'text', text: JSON.stringify(result) }] };
            }
            case 'connect': {
                const config = {
                    host: params.host,
                    port: params.port,
                    user: params.user,
                    password: params.password,
                    database: params.database,
                    readOnly: params.readOnly,
                    maxRetries: params.maxRetries,
                    retryDelay: params.retryDelay,
                };
                const result = (0, connect_1.connect)(config);
                return { content: [{ type: 'text', text: JSON.stringify(result) }] };
            }
            case 'disconnect': {
                const result = await (0, disconnect_1.disconnect)();
                return { content: [{ type: 'text', text: JSON.stringify(result) }] };
            }
            case 'begin_transaction': {
                const result = await (0, transaction_1.begin_transaction)();
                return { content: [{ type: 'text', text: JSON.stringify(result) }] };
            }
            case 'commit': {
                const result = await (0, transaction_1.commit)();
                return { content: [{ type: 'text', text: JSON.stringify(result) }] };
            }
            case 'rollback': {
                const result = await (0, transaction_1.rollback)();
                return { content: [{ type: 'text', text: JSON.stringify(result) }] };
            }
            default:
                return {
                    content: [{ type: 'text', text: `Unknown tool: ${name}` }],
                    isError: true,
                };
        }
    }
    catch (error) {
        return {
            content: [{ type: 'text', text: String(error) }],
            isError: true,
        };
    }
});
async function main() {
    const transport = new stdio_js_1.StdioServerTransport();
    await server.connect(transport);
}
main().catch(console.error);
//# sourceMappingURL=index.js.map